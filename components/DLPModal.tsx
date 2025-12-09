

import React, { useState, KeyboardEvent, useEffect } from 'react';
import { DLPFilter } from '../types';
import { X, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface DLPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filter: Partial<DLPFilter>) => void;
  initialData?: DLPFilter | null;
}

const BUILT_IN_TEMPLATES = [
  { 
    name: 'Credit Cards (Visa/MC/Amex + Luhn)', 
    description: 'Detects credit card numbers with Luhn algorithm validation. Supports Visa, Mastercard, American Express, and Discover cards.' 
  },
  { 
    name: 'SSN/National IDs (US/UK)', 
    description: 'Detects United States Social Security Numbers and UK National Insurance Numbers.' 
  },
  { 
    name: 'IBAN Numbers (International Banking)', 
    description: 'Detects International Bank Account Numbers (IBAN) compliant with ISO 13616.' 
  },
  { 
    name: 'Phone Numbers (US/International)', 
    description: 'Detects common phone number formats for US and International regions.' 
  },
  { 
    name: 'Email Addresses (RFC compliant)', 
    description: 'Detects standard RFC 5322 email addresses.' 
  },
  { 
    name: 'IP Addresses (IPv4/IPv6)', 
    description: 'Detects IPv4 and IPv6 addresses.' 
  },
  { 
    name: 'MAC Addresses (Network interfaces)', 
    description: 'Detects hardware MAC addresses in standard formats (e.g. 00:00:00:00:00:00).' 
  },
  { 
    name: 'Passport Numbers (Format validation)', 
    description: 'Detects passport numbers for various countries based on standard format validation.' 
  },
  { 
    name: 'Driver License Numbers', 
    description: 'Detects driver license patterns for supported regions (US, UK, EU, etc).' 
  }
];

export const DLPModal: React.FC<DLPModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  
  // Scope fields
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['sara55.co']);
  const [items, setItems] = useState<string[]>([]); // External items
  const [itemInputValue, setItemInputValue] = useState('');
  const [direction, setDirection] = useState<'Incoming' | 'Outgoing'>('Outgoing');

  const [type, setType] = useState<'Built-in' | 'Custom'>('Built-in');
  
  // Built-in fields
  const [selectedTemplateName, setSelectedTemplateName] = useState(BUILT_IN_TEMPLATES[0].name);
  const [description, setDescription] = useState(BUILT_IN_TEMPLATES[0].description);

  // Custom fields
  const [customPattern, setCustomPattern] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  // Common fields
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setSelectedDomains(initialData.domains.length > 0 ? initialData.domains : ['sara55.co']);
        setItems(initialData.items || []);
        setType(initialData.type);
        setCaseSensitive(initialData.caseSensitive);
        setNotes(initialData.notes || '');
        setDirection(initialData.direction || 'Outgoing');

        if (initialData.type === 'Built-in') {
          // Try to match exact name, if not found (e.g. legacy data), default to first
          const found = BUILT_IN_TEMPLATES.find(t => t.name === initialData.template);
          if (found) {
            setSelectedTemplateName(found.name);
            setDescription(found.description);
          } else {
             setSelectedTemplateName(BUILT_IN_TEMPLATES[0].name);
             setDescription(BUILT_IN_TEMPLATES[0].description);
          }
        } else {
          setCustomPattern(initialData.template);
          setKeywords(initialData.keywords);
        }
      } else {
        // Reset defaults
        setName('');
        setSelectedDomains(['sara55.co']);
        setItems([]);
        setItemInputValue('');
        setType('Built-in');
        setSelectedTemplateName(BUILT_IN_TEMPLATES[0].name);
        setDescription(BUILT_IN_TEMPLATES[0].description);
        setCustomPattern('');
        setKeywords([]);
        setCaseSensitive(false);
        setNotes('');
        setDirection('Outgoing');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplateName(val);
    const tpl = BUILT_IN_TEMPLATES.find(t => t.name === val);
    setDescription(tpl ? tpl.description : '');
  };

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (idx: number) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  // --- External Items Logic ---
  const validateInput = (value: string) => {
    // 1. Wildcard (All)
    if (value === '*') return true;
    // 2. IPv4 Address
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    if (ipv4Regex.test(value)) {
        const parts = value.split('/')[0].split('.');
        return parts.every(part => {
          const num = parseInt(part, 10);
          return num >= 0 && num <= 255;
        });
    }
    // 3. Email Address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(value)) return true;
    // 4. Wildcard Email
    const wildcardEmailRegex = /^\*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (wildcardEmailRegex.test(value)) return true;
    // 5. Domain Name
    const domainRegex = /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (domainRegex.test(value)) return true;
    // 6. IPv6
    if (value.includes(':') && /^[0-9a-fA-F:./]+$/.test(value)) return true;
    return false;
  };

  const handleItemKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const addItem = () => {
    const val = itemInputValue.trim().replace(/,$/, '');
    if (!val) return;
    if (items.includes(val)) {
      setError('Item already exists in the list.');
      return;
    }
    if (!validateInput(val)) {
      setError('Invalid format. Please enter a valid domain, email or IP.');
      return;
    }
    setItems([...items, val]);
    setItemInputValue('');
    setError('');
  };

  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter a name for this DLP filter.');
      return;
    }
    
    if (items.length === 0) {
      setError('Please add at least one external domain, email or IP address.');
      return;
    }

    if (type === 'Custom') {
      if (!customPattern.trim() && keywords.length === 0) {
        setError('Add a custom pattern or at least one keyword.');
        return;
      }
    }

    onSave({
      name,
      domains: selectedDomains,
      items,
      type,
      direction,
      template: type === 'Built-in' ? selectedTemplateName : customPattern,
      description: type === 'Built-in' ? description : undefined,
      keywords: type === 'Custom' ? keywords : [],
      caseSensitive: type === 'Built-in' ? false : caseSensitive, // Force false for built-in
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit DLP Filter' : 'Add DLP Filter'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Credit Cards, IBAN Numbers..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none"
            />
          </div>

          {/* Tenant Domains */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Applies to tenant domain(s) <span className="text-red-500">*</span></label>
            <select 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none bg-gray-50"
              value={selectedDomains[0]}
              onChange={(e) => setSelectedDomains([e.target.value])}
            >
              <option value="sara55.co">sara55.co</option>
              <option value="paying.co">paying.co</option>
              <option value="15koko.com">15koko.com</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose which of your domains this rule affects.
            </p>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Direction <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {['Incoming', 'Outgoing'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="direction" 
                    value={opt} 
                    checked={direction === opt}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="text-prox-green focus:ring-prox-green" 
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Specify if this filter applies to incoming or outgoing mail.
            </p>
          </div>

          {/* External Items */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">External domains, emails or IP addresses <span className="text-red-500">*</span></label>
            
            <div className="flex gap-0 shadow-sm rounded-sm">
               <input 
                  type="text" 
                  value={itemInputValue}
                  onChange={(e) => {
                    setItemInputValue(e.target.value);
                    if (error && error.includes('Invalid format')) setError('');
                  }}
                  onKeyDown={handleItemKeyDown}
                  placeholder="Example: * or *.contoso.com or *.com"
                  className="flex-1 border border-gray-300 rounded-l-sm border-r-0 px-3 py-2 text-sm focus:ring-1 focus:ring-prox-green focus:border-prox-green outline-none"
                />
                <button 
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-sm flex items-center justify-center transition-colors"
                  type="button"
                >
                  <Plus className="w-5 h-5" />
                </button>
            </div>
            
            {/* Added Items List */}
            <div className="mt-3 flex flex-col border-t border-gray-100">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white border-b border-gray-100 py-2.5 px-1 hover:bg-gray-50 transition-colors group">
                  <span className="text-sm text-gray-700 font-medium ml-1">{item}</span>
                  <button 
                      onClick={() => removeItem(idx)} 
                      className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                      title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="py-2 text-center">
                  <span className="text-xs text-gray-400 italic">No external entities added.</span>
                </div>
              )}
            </div>
          </div>

          {/* Template Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Template Type <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="dlpType" 
                  checked={type === 'Built-in'}
                  onChange={() => setType('Built-in')}
                  className="text-prox-green focus:ring-prox-green" 
                />
                <span className="text-sm text-gray-700">Built-in template</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="dlpType" 
                  checked={type === 'Custom'}
                  onChange={() => setType('Custom')}
                  className="text-prox-green focus:ring-prox-green" 
                />
                <span className="text-sm text-gray-700">Custom pattern</span>
              </label>
            </div>
          </div>

          {type === 'Built-in' ? (
            /* Built-in Mode */
            <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Built-in Template <span className="text-red-500">*</span></label>
                <select 
                  value={selectedTemplateName}
                  onChange={handleTemplateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none"
                >
                  {BUILT_IN_TEMPLATES.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <div className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 text-sm text-gray-600">
                  {description}
                </div>
              </div>
            </div>
          ) : (
            /* Custom Mode */
            <div className="space-y-4 bg-white p-4 rounded border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Custom pattern</label>
                <input 
                  type="text" 
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  placeholder="Enter regex pattern or hash..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use a regular expression or a SHA-256 hash for exact file/content matching.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Custom keywords</label>
                <div className="border border-gray-300 rounded px-3 py-2 focus-within:ring-1 focus-within:ring-prox-green focus-within:border-prox-green bg-white">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {keywords.map((kw, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm flex items-center gap-1 border border-gray-200">
                        {kw}
                        <button onClick={() => removeKeyword(idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Type a keyword and press Enter..."
                    className="w-full outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keywords are matched in addition to the pattern. Leave empty if you don’t need keyword matching.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="rounded text-prox-green focus:ring-prox-green"
                  />
                  <span className="text-sm font-bold text-gray-700">Case sensitive</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 pl-6">
                  Enable case-sensitive matching for this custom pattern and keywords.
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Temporary rule for project X data."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none h-20 resize-none"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-prox-green hover:bg-prox-green-dark rounded shadow-sm transition-colors"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};
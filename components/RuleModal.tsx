
import React, { useState, KeyboardEvent } from 'react';
import { BWRule } from '../types';
import { X, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Partial<BWRule>) => void;
  initialData?: BWRule | null;
}

export const RuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [type, setType] = useState<'Allow' | 'Block'>(initialData?.type || 'Allow');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(initialData ? [initialData.domain] : ['sara55.co']);
  const [direction, setDirection] = useState<'Incoming' | 'Outgoing' | 'Both'>(initialData?.direction || 'Incoming');
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<string[]>(initialData?.items || []);
  const [reason, setReason] = useState(initialData?.reason || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip();
    }
  };

  const validateInput = (value: string) => {
    // 1. Wildcard (All)
    if (value === '*') return true;

    // 2. IPv4 Address (Simple check including optional CIDR)
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

    // 4. Wildcard Email (*@domain.com)
    const wildcardEmailRegex = /^\*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (wildcardEmailRegex.test(value)) return true;

    // 5. Domain Name (and wildcard domain *.domain.com)
    const domainRegex = /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (domainRegex.test(value)) return true;

    // 6. IPv6 (Basic heuristic)
    if (value.includes(':') && /^[0-9a-fA-F:./]+$/.test(value)) return true;

    return false;
  };

  const addChip = () => {
    const val = inputValue.trim().replace(/,$/, '');
    
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
    setInputValue('');
    setError('');
  };

  const removeChip = (indexToRemove: number) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = () => {
    if (items.length === 0) {
      setError('Please add at least one domain or email address.');
      return;
    }
    
    onSave({
      domain: selectedDomains[0],
      type,
      direction,
      items,
      reason: reason || undefined,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedBy: 'admin@worldposta.com'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Rule' : 'Add Rule'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Rule Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rule type <span className="text-red-500">*</span></label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as 'Allow' | 'Block')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none"
            >
              <option value="Allow">Allow list (whitelist)</option>
              <option value="Block">Block list (blacklist)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Allow list always wins when both allow and block rules match the same message.
            </p>
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
              {['Incoming', 'Outgoing', 'Both'].map((opt) => (
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
              Incoming: mail from internet to users. Outgoing: mail from users to internet.
            </p>
          </div>

          {/* External Domains / Addresses */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">External domains, emails or IP addresses <span className="text-red-500">*</span></label>
            
            <div className="flex gap-0 shadow-sm rounded-sm">
               <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: * or *.contoso.com or *.com"
                  className="flex-1 border border-gray-300 rounded-l-sm border-r-0 px-3 py-2 text-sm focus:ring-1 focus:ring-prox-green focus:border-prox-green outline-none"
                />
                <button 
                  onClick={addChip}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-sm flex items-center justify-center transition-colors"
                  type="button"
                >
                  <Plus className="w-5 h-5" />
                </button>
            </div>
            
            {error && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" /> {error}
              </p>
            )}

            {/* Added Items List */}
            <div className="mt-3 flex flex-col border-t border-gray-100">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white border-b border-gray-100 py-2.5 px-1 hover:bg-gray-50 transition-colors group">
                  <span className="text-sm text-gray-700 font-medium ml-1">{item}</span>
                  <button 
                      onClick={() => removeChip(idx)} 
                      className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                      title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="py-4 text-center">
                  <span className="text-xs text-gray-400 italic">No domains added yet.</span>
                </div>
              )}
            </div>

          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Reason / note</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Temporary allow for vendor integration testing."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-prox-green focus:ring-1 focus:ring-prox-green outline-none h-20 resize-none"
            />
          </div>

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
            Save Rule
          </button>
        </div>

      </div>
    </div>
  );
};

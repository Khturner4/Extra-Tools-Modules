

import React, { useState } from 'react';
import { DLPFilter } from '../types';
import { DLPModal } from './DLPModal';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  ShieldQuestion, 
  Tag, 
  Check, 
  X as XIcon,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';

export const DLPList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Built-in' | 'Custom'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<DLPFilter | null>(null);

  // Mock Data
  const [filters, setFilters] = useState<DLPFilter[]>([
    {
      id: '1',
      name: 'Credit Cards',
      type: 'Built-in',
      template: 'Credit Cards (Visa/MC/Amex + Luhn)',
      keywords: [],
      caseSensitive: false,
      updatedAt: '2025-11-20 09:35',
      domains: ['sara55.co'],
      items: ['*'],
      direction: 'Outgoing'
    },
    {
      id: '2',
      name: 'Project Alpha Keywords',
      type: 'Custom',
      template: '',
      keywords: ['alpha-secret', 'top-secret', 'confidential'],
      caseSensitive: true,
      updatedAt: '2025-11-18 14:20',
      notes: 'Keywords for Project Alpha DLP policy',
      domains: ['paying.co'],
      items: ['user@paying.co', 'admin@paying.co'],
      direction: 'Incoming'
    },
    {
      id: '3',
      name: 'Custom Regex - Invoice IDs',
      type: 'Custom',
      template: '^INV-\\d{6}-[A-Z]{2}$',
      keywords: [],
      caseSensitive: true,
      updatedAt: '2025-11-15 10:00',
      domains: ['15koko.com'],
      items: ['finance@15koko.com'],
      direction: 'Outgoing'
    },
    {
      id: '4',
      name: 'IBAN Numbers',
      type: 'Built-in',
      template: 'IBAN Numbers (International Banking)',
      keywords: [],
      caseSensitive: false,
      updatedAt: '2025-10-30 11:45',
      domains: ['sara55.co'],
      items: ['*'],
      direction: 'Incoming'
    },
    {
      id: '5',
      name: 'Passport Validation',
      type: 'Built-in',
      template: 'Passport Numbers (Format validation)',
      keywords: [],
      caseSensitive: false,
      updatedAt: '2025-10-28 16:30',
      domains: ['sara55.co'],
      items: ['hr@sara55.co'],
      direction: 'Outgoing'
    }
  ]);

  const filteredData = filters.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'All' || f.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSave = (data: Partial<DLPFilter>) => {
    if (editingFilter) {
      setFilters(filters.map(f => f.id === editingFilter.id ? { ...f, ...data } as DLPFilter : f));
    } else {
      const newFilter: DLPFilter = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'New Filter',
        type: data.type || 'Custom',
        template: data.template || '',
        keywords: data.keywords || [],
        caseSensitive: data.caseSensitive || false,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        domains: data.domains || ['sara55.co'],
        items: data.items || [],
        direction: data.direction || 'Outgoing',
        ...data
      };
      setFilters([newFilter, ...filters]);
    }
  };

  const handleEdit = (filter: DLPFilter) => {
    setEditingFilter(filter);
    setIsModalOpen(true);
  };

  const handleDelete = (filter: DLPFilter) => {
    if (window.confirm(`Are you sure you want to delete the DLP filter "${filter.name}"?`)) {
      setFilters(filters.filter(f => f.id !== filter.id));
    }
  };

  const DirectionIcon = ({ dir }: { dir: string }) => {
    if (dir === 'Incoming') return <ArrowDown className="w-3.5 h-3.5" />;
    return <ArrowUp className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-[#e5e7eb] min-h-[calc(100vh-140px)] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">DLP Filters</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage data-loss prevention patterns and templates.</p>
        </div>
        
        <button 
          onClick={() => { setEditingFilter(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-prox-green hover:bg-prox-green-dark text-white px-5 py-2.5 rounded shadow-sm text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add DLP Filter
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
           {/* Type Filter */}
           <div className="flex gap-2">
            {['All', 'Built-in', 'Custom'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterType === type 
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, template, keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-prox-green focus:border-prox-green transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Direction</th>
                <th className="px-6 py-3">Template / Pattern</th>
                <th className="px-6 py-3">Keywords</th>
                <th className="px-6 py-3 text-center">Case Sensitive</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((filter) => (
                <tr key={filter.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-800">{filter.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      filter.type === 'Built-in' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {filter.type === 'Built-in' ? <ShieldCheck className="w-3 h-3"/> : <ShieldQuestion className="w-3 h-3"/>}
                      {filter.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                       <DirectionIcon dir={filter.direction} />
                       {filter.direction}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {filter.type === 'Built-in' ? (
                      <span className="text-gray-700">{filter.template}</span>
                    ) : (
                      <span className="text-gray-500 truncate block max-w-[200px]" title={filter.template}>
                        {filter.template || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap max-w-xs">
                      {filter.keywords.slice(0, 2).map((k, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-gray-400" />
                          {k}
                        </span>
                      ))}
                      {filter.keywords.length > 2 && (
                        <span className="text-xs text-gray-400 pl-1">+{filter.keywords.length - 2} more</span>
                      )}
                      {filter.keywords.length === 0 && <span className="text-gray-300">-</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {filter.caseSensitive ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XIcon className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {filter.updatedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(filter)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-prox-green"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(filter)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-gray-400 border-t border-gray-100">
              No filters found.
            </div>
          )}
        </div>
      </div>

      <DLPModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingFilter}
      />
    </div>
  );
};
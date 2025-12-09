
import React, { useState } from 'react';
import { BWRule } from '../types';
import { RuleModal } from './RuleModal';
import { 
  Globe, 
  Trash2, 
  Plus, 
  Search, 
  ShieldAlert, 
  LayoutGrid, 
  List as ListIcon,
  AlertTriangle,
  Edit,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export const BWList: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterType, setFilterType] = useState<'All' | 'Allow' | 'Block' | 'SPF Whitelist'>('All');
  const [filterDirection, setFilterDirection] = useState<'All' | 'Incoming' | 'Outgoing' | 'Both'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BWRule | null>(null);

  // Mock Data
  const [rules, setRules] = useState<BWRule[]>([
    {
      id: '1',
      domain: 'sara55.co',
      type: 'Block',
      direction: 'Incoming',
      items: ['bnbnb.sdsd'],
      updatedAt: '2025-10-28 14:22',
      updatedBy: 'admin@worldposta.com'
    },
    {
      id: '2',
      domain: 'paying.co',
      type: 'Block',
      direction: 'Both',
      items: ['abc.abc', 'abdd@asd.asd', 'eeldeen@as.da', 'asdf.xz', 'xcvasd.asd', 'domain1.com', 'domain2.com', 'user@domain.com', 'fgfg.fg'],
      updatedAt: '2025-10-29 09:15',
      updatedBy: 'system'
    },
    {
      id: '3',
      domain: 'paying.co',
      type: 'Allow',
      direction: 'Incoming',
      items: ['vendor.com', '*@partner.net', 'user@example.org'],
      updatedAt: '2025-10-29 11:30',
      updatedBy: 'support@roaya.co',
      reason: 'Key partner integration'
    },
    {
      id: '4',
      domain: '15koko.com',
      type: 'Block',
      direction: 'Outgoing',
      items: ['spam-bot.net'],
      updatedAt: '2025-10-25 16:45',
      updatedBy: 'admin@worldposta.com'
    },
    {
      id: '5',
      domain: 'kjkjklj.no',
      type: 'Allow',
      direction: 'Both',
      items: ['asdf.asd', 'mew@asd.asd'],
      updatedAt: '2025-10-27 10:00',
      updatedBy: 'admin@worldposta.com'
    }
  ]);

  // Derived Stats
  const stats = {
    domains: new Set(rules.map(r => r.domain)).size,
    allow: rules.filter(r => r.type === 'Allow').length,
    block: rules.filter(r => r.type === 'Block').length,
    spf: rules.filter(r => r.type === 'SPF Whitelist').length,
  };

  // Filtering Logic
  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.domain.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rule.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || rule.type === filterType;
    const matchesDirection = filterDirection === 'All' || rule.direction === filterDirection;

    return matchesSearch && matchesType && matchesDirection;
  });

  const handleSaveRule = (newRuleData: Partial<BWRule>) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...newRuleData } as BWRule : r));
    } else {
      const newRule: BWRule = {
        id: Math.random().toString(36).substr(2, 9),
        domain: newRuleData.domain || '',
        type: newRuleData.type || 'Allow',
        direction: newRuleData.direction || 'Incoming',
        items: newRuleData.items || [],
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        updatedBy: 'admin@worldposta.com',
        ...newRuleData
      };
      setRules([newRule, ...rules]);
    }
  };

  const handleEdit = (rule: BWRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  // Helper for Direction Icon
  const DirectionIcon = ({ dir }: { dir: string }) => {
    if (dir === 'Incoming') return <ArrowDown className="w-3.5 h-3.5" />;
    if (dir === 'Outgoing') return <ArrowUp className="w-3.5 h-3.5" />;
    return <ArrowUpDown className="w-3.5 h-3.5" />;
  };

  const getBadgeStyles = (type: string) => {
    if (type === 'Block') return 'bg-red-100 text-red-700';
    if (type === 'SPF Whitelist') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  const getBadgeLabel = (type: string) => {
    if (type === 'Allow') return 'Allow List';
    if (type === 'Block') return 'Block List';
    return type;
  };

  return (
    <div className="bg-[#e5e7eb] min-h-[calc(100vh-140px)] space-y-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Allow / Block Rules</h1>
          <p className="text-gray-500 text-sm mt-1">Manage incoming and outgoing allow/block rules for your domains.</p>
          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500">
            <span className="px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">{stats.domains} tenant domains</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{stats.allow} allow rules</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{stats.block} block rules</span>
            {stats.spf > 0 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{stats.spf} SPF rules</span>}
          </div>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-prox-green hover:bg-prox-green-dark text-white px-5 py-2.5 rounded shadow-sm text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Rule
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        
        {/* Left: Toggles & Filters */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
            <button 
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-white shadow text-prox-green' : 'text-gray-500 hover:text-gray-700'}`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow text-prox-green' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {['All', 'Allow', 'Block', 'SPF Whitelist'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterType === type 
                    ? type === 'Allow' ? 'bg-green-100 text-green-700 border-green-200' 
                    : type === 'Block' ? 'bg-red-100 text-red-700 border-red-200' 
                    : type === 'SPF Whitelist' ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type === 'All' ? 'All Rules' : type === 'Allow' ? 'Allow only' : type === 'Block' ? 'Block only' : 'SPF only'}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

          {/* Direction Filter */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select 
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value as any)}
              className="pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-prox-green focus:border-prox-green appearance-none cursor-pointer"
            >
              <option value="All">All Directions</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        {/* Right: Search */}
        <div className="w-full xl:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tenant domains, external domains or emails..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-prox-green focus:border-prox-green transition-all"
          />
        </div>
      </div>

      {/* 3. Content Area */}
      {viewMode === 'cards' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRules.map((rule) => (
            <div 
              key={rule.id} 
              className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white border border-gray-100 shadow-sm text-gray-600`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-md leading-tight">{rule.domain}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles(rule.type)}`}>
                        {getBadgeLabel(rule.type)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                        <DirectionIcon dir={rule.direction} /> {rule.direction}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Mock Conflict Warning */}
                {rules.some(r => r.domain === rule.domain && r.type !== rule.type && r.type !== 'SPF Whitelist' && rule.type !== 'SPF Whitelist' && r.items.some(i => rule.items.includes(i))) && (
                  <div className="text-orange-500" title="Possible conflict detected">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">External domains / addresses</p>
                <div className="flex flex-wrap gap-2">
                  {rule.items.slice(0, 5).map((item, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                  {rule.items.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-500 text-xs font-medium border border-dashed border-gray-300">
                      +{rule.items.length - 5} more
                    </span>
                  )}
                </div>
                {rule.reason && (
                  <p className="mt-3 text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
                    "{rule.reason}"
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                 <div className="flex flex-col">
                   <span className="font-semibold text-gray-600">{rule.items.length} entries</span>
                   <span className="text-[10px] text-gray-400">Upd: {rule.updatedAt.split(' ')[0]} by {rule.updatedBy.split('@')[0]}</span>
                 </div>
                 
                 <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEdit(rule)}
                      className="p-1.5 text-gray-400 hover:text-prox-green hover:bg-white rounded transition-colors" 
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(rule.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Tenant Domain</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Direction</th>
                  <th className="px-6 py-3">External Domains / Emails</th>
                  <th className="px-6 py-3 text-center">Entries</th>
                  <th className="px-6 py-3">Updated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-800">{rule.domain}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles(rule.type)}`}>
                        {getBadgeLabel(rule.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <DirectionIcon dir={rule.direction} />
                        {rule.direction}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {rule.items.slice(0, 2).map((item, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{item}</span>
                        ))}
                        {rule.items.length > 2 && (
                          <span className="text-xs text-gray-400 pl-1">+{rule.items.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs">{rule.items.length}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <div>{rule.updatedAt}</div>
                      <div className="text-[10px] text-gray-400">{rule.updatedBy}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(rule)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-prox-green"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(rule.id)}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <ShieldAlert className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-700">No rules found</h3>
          <p className="text-gray-500 text-sm mb-6">No rules match your current filters or search query.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterType('All'); setFilterDirection('All');}}
            className="text-prox-green hover:text-prox-green-dark font-semibold text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modal */}
      <RuleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        initialData={editingRule}
      />
    </div>
  );
};

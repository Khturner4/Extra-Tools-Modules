import React from 'react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const inputClass = "w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-prox-green focus:ring-1 focus:ring-prox-green transition-colors text-gray-700 bg-white";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide";

  return (
    <div className="mb-6 border-b border-gray-200 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        {/* Row 1 */}
        <div className="md:col-span-4">
          <label className={labelClass}>Domains</label>
          <select 
            name="domain" 
            value={filters.domain} 
            onChange={handleChange}
            className={inputClass}
          >
            <option value="sara55.co">sara55.co</option>
            <option value="all">All Domains</option>
          </select>
        </div>
        
        <div className="md:col-span-4">
          <label className={labelClass}>Status</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Spam Quarantine">Spam Quarantine</option>
            <option value="Clean">Clean</option>
            <option value="Virus">Virus</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <label className={labelClass}>Direction</label>
          <select 
            name="direction" 
            value={filters.direction} 
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
          </select>
        </div>

        {/* Row 2 */}
        <div className="md:col-span-3">
          <label className={labelClass}>Subject</label>
          <input 
            type="text" 
            name="subject" 
            placeholder="Enter subject" 
            value={filters.subject}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>Sender</label>
          <input 
            type="text" 
            name="sender" 
            placeholder="Enter sender" 
            value={filters.sender}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>Receiver</label>
          <input 
            type="text" 
            name="receiver" 
            placeholder="Enter receiver" 
            value={filters.receiver}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>Virus Info</label>
          <input 
            type="text" 
            name="virusInfo" 
            placeholder="Enter virus info" 
            value={filters.virusInfo}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Row 3 - Dates */}
        <div className="md:col-span-3">
          <label className={labelClass}>From Date</label>
          <input 
            type="date" 
            name="fromDate" 
            value={filters.fromDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>To Date</label>
          <input 
            type="date" 
            name="toDate" 
            value={filters.toDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="bg-prox-green hover:bg-prox-green-dark text-white font-semibold py-1.5 px-6 rounded-sm text-sm shadow-sm transition-colors">
          Search
        </button>
        <button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-1.5 px-6 rounded-sm text-sm shadow-sm transition-colors">
          Clear
        </button>
      </div>
    </div>
  );
};
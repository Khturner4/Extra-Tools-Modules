
import React from 'react';
import { Home, ChevronRight, Bolt, List, Shield, FileSearch } from 'lucide-react';

interface HeaderProps {
  currentView: 'logs' | 'bwlist' | 'dlp';
  onNavigate: (view: 'logs' | 'bwlist' | 'dlp') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {/* Top Bar simulating the Proxmox header environment */}
      <div className="bg-[#fcfcfc] text-white p-2 px-4 flex items-center justify-between text-sm shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-4">
           <span className="font-bold text-lg tracking-tight text-prox-gray cursor-pointer" onClick={() => onNavigate('logs')}>Proxmox</span>
           <div className="flex items-center gap-4 text-gray-500 font-medium">
             <span className="hover:text-prox-green cursor-pointer transition-colors">Billing</span>
             <span className="hover:text-prox-green cursor-pointer transition-colors">Migrations</span>
             <span className="hover:text-prox-green cursor-pointer transition-colors">Exchange</span>
             <span className="hover:text-prox-green cursor-pointer transition-colors">Customers</span>
             <span className="hover:text-prox-green cursor-pointer transition-colors">Reports</span>
             <span className="hover:text-prox-green cursor-pointer transition-colors">Tickets</span>
           </div>
        </div>
        <div>
          <Bolt className="w-4 h-4 text-gray-400 hover:text-prox-green cursor-pointer" />
        </div>
      </div>

      {/* Breadcrumb / Context Bar */}
      <div className="bg-[#e5e7eb] px-4 py-3 flex items-center justify-between text-sm">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-gray-600">
          <div className="flex items-center gap-1 font-semibold text-gray-800">
             <Home className="w-4 h-4 text-gray-500 mb-0.5" />
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700">Sara 55</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-prox-green font-bold">
            {currentView === 'logs' ? 'Proxmox Logs' : currentView === 'bwlist' ? 'White/Black List' : 'DLP Filters'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-200/50 p-1 rounded-lg gap-1">
          <button
            onClick={() => onNavigate('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              currentView === 'logs' 
                ? 'bg-white text-prox-green shadow-sm' 
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            LOGS
          </button>
          <button
            onClick={() => onNavigate('bwlist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              currentView === 'bwlist' 
                ? 'bg-white text-prox-green shadow-sm' 
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            RULES
          </button>
          <button
            onClick={() => onNavigate('dlp')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              currentView === 'dlp' 
                ? 'bg-white text-prox-green shadow-sm' 
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            DLP
          </button>
        </div>

      </div>
    </div>
  );
};


import React from 'react';
import { Home, ChevronRight, Bolt } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {/* Top Bar simulating the Proxmox header environment */}
      <div className="bg-[#fcfcfc] text-white p-2 px-4 flex items-center justify-between text-sm shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-4">
           <span className="font-bold text-lg tracking-tight text-prox-gray cursor-pointer" onClick={() => onNavigate('dashboard')}>Posta Gate</span>
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
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-1 font-semibold text-gray-800 hover:text-prox-green transition-colors">
             <Home className="w-4 h-4 text-gray-500 mb-0.5" />
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700">Sara 55</span>
          
          {currentView !== 'dashboard' && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-prox-green font-bold animate-in fade-in slide-in-from-left-2">
                {currentView === 'logs' ? 'Proxmox Logs' : currentView === 'bwlist' ? 'White/Black List' : 'DLP Filters'}
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

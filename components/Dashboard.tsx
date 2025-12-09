
import React from 'react';
import { View } from '../types';
import { 
  Shield, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Users, 
  BarChart, 
  Settings, 
  CreditCard, 
  RefreshCw,
  Globe,
  ArrowRightLeft,
  ClipboardList,
  GlobeLock
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Helper for consistent tile design
  const Tile = ({ icon: Icon, title, subtitle, onClick, colorClass = "text-prox-green", bgClass = "bg-gray-50" }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 ${bgClass} border border-gray-100 rounded-lg hover:bg-white hover:shadow-md hover:border-prox-green/30 transition-all duration-200 group text-center h-full w-full`}
    >
      <div className={`p-3 rounded-lg bg-white border border-gray-200 shadow-sm mb-3 group-hover:scale-105 transition-transform ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="font-bold text-gray-700 text-sm mb-1">{title}</span>
      {subtitle && <span className="text-xs text-gray-400 leading-tight max-w-[150px]">{subtitle}</span>}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      <div className="flex items-center justify-between mb-2">
         <h1 className="text-2xl font-bold text-gray-700">Worldadmin</h1>
         <div className="flex gap-2">
            <button className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200 hover:text-prox-green">
                <BarChart className="w-4 h-4" /> Dashboard
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">

          {/* Exchange Email Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-prox-green-dark/80 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Exchange Email
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <Tile icon={Mail} title="Mailboxes" colorClass="text-gray-500" onClick={() => {}} />
                <Tile icon={Users} title="Distribution List" colorClass="text-gray-500" onClick={() => {}} />
                <Tile icon={ArrowRightLeft} title="Shared Contacts" colorClass="text-gray-500" onClick={() => {}} />
                <Tile icon={Settings} title="Rules" colorClass="text-gray-500" onClick={() => {}} />
                <Tile icon={RefreshCw} title="Running Tasks" colorClass="text-gray-500" onClick={() => {}} />
                <Tile 
                  icon={RefreshCw} 
                  title="Background Tasks" 
                  colorClass="text-gray-500" 
                  subtitle="Monitor and manage background jobs for this tenant."
                  onClick={() => {}} 
                />
              </div>
            </div>
          </div>

                    {/* Security Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-prox-green flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Posta SecureGate
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Tile 
                  icon={FileText}
                  title="SMTP Logs"
                  subtitle="View spam, virus and policy logs for this customer."
                  onClick={() => onNavigate('logs')}
                />
                <Tile 
                  icon={ShieldCheck}
                  title="Security Rules"
                  subtitle="Manage spam, content and routing rules."
                  onClick={() => onNavigate('bwlist')}
                />
                <Tile 
                  icon={Lock}
                  title="DLP Filters"
                  subtitle="Create and manage data-loss prevention templates."
                  onClick={() => onNavigate('dlp')}
                />
                <Tile 
                  icon={ClipboardList}
                  title="Action Logs"
                  subtitle="View admin actions and configuration changes."
                  onClick={() => {}} 
                />
                <Tile 
                  icon={GlobeLock}
                  title="Webmail IP Access Control"
                  subtitle="Manage allowed and blocked IP addresses for users email access."
                  onClick={() => {}} 
                />
              </div>
            </div>
          </div>
          
          {/* Admin & Billing Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-prox-green-dark/80 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin & Billing
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Tile icon={CreditCard} title="Billing" colorClass="text-gray-500" onClick={() => {}} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
           {/* Organizations Section */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-prox-green-dark/80 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Organizations
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                <Tile icon={Globe} title="Organizations & Domains" colorClass="text-gray-500" onClick={() => {}} />
                <Tile icon={BarChart} title="Account Statistics" colorClass="text-gray-500" onClick={() => {}} />
              </div>
            </div>
          </div>

          {/* Migrations Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-prox-green-dark/80 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Migrations
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 gap-4">
                <Tile icon={ArrowRightLeft} title="Migrations" colorClass="text-gray-500" onClick={() => {}} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

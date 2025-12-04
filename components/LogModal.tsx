import React from 'react';
import { LogEntry } from '../types';
import { X, FileText, Globe, Bug } from 'lucide-react';

interface LogModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

export const LogModal: React.FC<LogModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  // Handler to close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-prox-green" />
            Log Details
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded border border-blue-100">
              <span className="text-xs font-bold text-blue-400 uppercase">Score</span>
              <div className="text-xl font-bold text-blue-700">{log.sa_score}</div>
            </div>
            <div className={`bg-gray-50 p-3 rounded border ${log.status === 'Virus' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
               <span className={`text-xs font-bold uppercase ${log.status === 'Virus' ? 'text-red-400' : 'text-green-400'}`}>Status</span>
               <div className={`text-lg font-bold ${log.status === 'Virus' ? 'text-red-700' : 'text-green-700'}`}>{log.status}</div>
            </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200">
               <span className="text-xs font-bold text-gray-400 uppercase">Total Time</span>
               <div className="text-lg font-bold text-gray-700">{log.processing_time_ms}ms</div>
            </div>
          </div>

          {/* Detailed Grid */}
          <div className="grid grid-cols-1 gap-y-4 text-sm">
            
            {/* Virus Info Highlight if present */}
            {log.virus_info && (
              <div className="bg-red-50 border border-red-100 p-3 rounded mb-2">
                <div className="flex items-start gap-2">
                  <Bug className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <span className="text-red-800 font-bold block text-xs uppercase mb-1">Virus Detected</span>
                    <span className="text-red-700 font-mono text-sm break-all">{log.virus_info}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Sender</span>
              <span className="text-gray-800 font-medium md:col-span-2 break-all">{log.sender}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Receiver</span>
              <span className="text-gray-800 font-medium md:col-span-2 break-all">{log.receiver}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Client Hostname</span>
              <span className="text-gray-800 font-mono md:col-span-2 break-all">{log.client_hostname}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Client IP</span>
              <div className="flex items-center gap-2 md:col-span-2">
                 <Globe className="w-3 h-3 text-gray-400" />
                 <span className="text-gray-800 font-mono">{log.client_ip}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Message ID</span>
              <span className="text-gray-800 font-mono text-xs md:col-span-2 break-all">{log.message_id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Log ID</span>
              <span className="text-gray-800 font-mono md:col-span-2">{log.logid}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-medium md:col-span-1">Processing Breakdown</span>
              <div className="md:col-span-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded">Spam: {log.spam_time}ms</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Clam: {log.clam_time}ms</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Custom: {log.custom_time}ms</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-gray-500 font-medium block mb-2">Spam Assassin Hits</span>
              <div className="flex flex-wrap gap-1">
                {log.sa_hits.map((hit, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-xs font-mono break-all">
                    {hit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
           <button 
             onClick={onClose}
             className="bg-prox-green hover:bg-prox-green-dark text-white px-4 py-2 rounded shadow-sm text-sm font-semibold transition-colors"
           >
             Close Details
           </button>
        </div>
      </div>
    </div>
  );
};
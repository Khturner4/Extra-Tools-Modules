
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { LogModal } from './components/LogModal';
import { BWList } from './components/BWList';
import { DLPList } from './components/DLPList';
import { LogEntry, FilterState } from './types';
import { AlertCircle, CheckCircle, Bug, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

// Mock Data Generation
const generateMockData = (): LogEntry[] => {
  return [
    {
      id: '1',
      time: '29/10/2025 09:23:11',
      client_ip: '209.85.216.44',
      client_hostname: 'mail-pj1-f44.google.com',
      message_id: '<CAODhbd+PWyptwT8_hmYKkGExg0e8LkFyDKGNfqDaPOy5HU=2ow@mail.gmail.com>',
      logid: 'C206D692F0411996AB',
      sa_score: '0/5.5',
      sa_hits: [
        'FREEMAIL_ENVFROM_END_DIGIT',
        'FREEMAIL_FROM',
        'HTML_MESSAGE',
        'WORLDPOSTA_AI_HAM',
        'WORLDPOSTA_DQS_CLEAN',
        'WORLDPOSTA_RSPAMD_DMARC_PASS'
      ],
      processing_time_ms: 236,
      spam_time: 134,
      clam_time: 42,
      custom_time: 0,
      direction: 'Incoming',
      status: 'Spam Quarantine',
      sender: 'dongminhdv1@gmail.com',
      receiver: 'asaeed@roaya.co',
      subject: 'LOAN OFFER.'
    },
    {
      id: '2',
      time: '29/10/2025 08:55:02',
      client_ip: '192.168.1.105',
      client_hostname: 'websecure.account.net',
      message_id: '<billing-update-2938@websecure.account.net>',
      logid: 'A102B55990211',
      sa_score: '4.2/5.5',
      sa_hits: ['HTML_FONT_LOW_CONTRAST', 'MIME_HTML_ONLY', 'SPF_SOFTFAIL'],
      processing_time_ms: 180,
      spam_time: 100,
      clam_time: 80,
      custom_time: 0,
      direction: 'Incoming',
      status: 'Spam Quarantine',
      sender: 'securemail-accountent@websecure.account.net',
      receiver: 'wp-support@roaya.co',
      subject: 'Billing and Payments - Netflix Support'
    },
    {
      id: '3',
      time: '29/10/2025 07:58:04',
      client_ip: '209.85.216.44',
      client_hostname: 'mail-pj1-f44.google.com',
      message_id: '<CAODhbd+22334455@mail.gmail.com>',
      logid: 'D998E7766543',
      sa_score: '0.1/5.5',
      sa_hits: ['FREEMAIL_FROM', 'DKIM_SIGNED'],
      processing_time_ms: 150,
      spam_time: 100,
      clam_time: 50,
      custom_time: 0,
      direction: 'Incoming',
      status: 'Clean',
      sender: 'support@google.com',
      receiver: 'drive@roaya.co',
      subject: 'Security Alert: New login detected'
    },
    {
      id: '4',
      time: '29/10/2025 07:29:21',
      client_ip: '209.85.216.44',
      client_hostname: 'mail-pj1-f44.google.com',
      message_id: '<CAODhbd+998877@mail.gmail.com>',
      logid: 'F1122334455',
      sa_score: '12.5/5.5',
      sa_hits: ['Heuristics.Phishing.Email.SpoofedDomain', 'HTML_MESSAGE'],
      processing_time_ms: 210,
      spam_time: 150,
      clam_time: 60,
      custom_time: 0,
      direction: 'Incoming',
      status: 'Virus',
      virus_info: 'Heuristics.Phishing.Email.SpoofedDomain',
      sender: 'urgent@bank-verify-secure.com',
      receiver: 'nshams@roaya.co',
      subject: 'URGENT: Verify your account now'
    },
    {
      id: '5',
      time: '29/10/2025 07:02:56',
      client_ip: '10.0.0.55',
      client_hostname: 'mandrillapp.com',
      message_id: '<bounce-md_31139@mandrillapp.com>',
      logid: 'B5544332211',
      sa_score: '-1.5/5.5',
      sa_hits: ['DKIM_VALID', 'SPF_PASS'],
      processing_time_ms: 120,
      spam_time: 80,
      clam_time: 40,
      custom_time: 0,
      direction: 'Outgoing',
      status: 'Delivered',
      sender: 'm.abdelrahim@roaya.co',
      receiver: 'client@external-domain.com',
      subject: 'Re: Project Update Q4'
    }
  ];
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'logs' | 'bwlist' | 'dlp'>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    domain: 'sara55.co',
    status: 'Spam Quarantine',
    direction: 'Incoming',
    subject: '',
    sender: '',
    receiver: '',
    virusInfo: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    // Simulate fetching data
    setLogs(generateMockData());
  }, []);

  const handleRowClick = (log: LogEntry) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  return (
    <div className="min-h-screen bg-[#e5e7eb] pb-20">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header currentView={currentView} onNavigate={setCurrentView} />
        
        {currentView === 'logs' ? (
          /* Logs View */
          <div className="bg-white rounded shadow-sm border border-gray-200">
            
            <div className="p-4 border-b border-gray-200 bg-white rounded-t">
              <h2 className="text-xl font-bold text-prox-green mb-4">Prox Logs</h2>
              
              <FilterBar filters={filters} setFilters={setFilters} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-white text-gray-800 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold whitespace-nowrap w-[130px]">Time</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[160px]">Status</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[90px]">Score</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[200px]">Sender</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[200px]">Receiver</th>
                    <th className="p-4 font-bold whitespace-nowrap">Subject</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[140px]">Client IP</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[80px] text-center">Virus</th>
                    <th className="p-4 font-bold whitespace-nowrap w-[80px] text-center">Dir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => handleRowClick(log)}
                      className="hover:bg-green-50/30 cursor-pointer transition-colors group"
                    >
                      {/* Time */}
                      <td className="p-4 align-top whitespace-nowrap text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">{log.time.split(' ')[0]}</span>
                          <span className="text-xs text-gray-400">{log.time.split(' ')[1]}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          {log.status === 'Spam Quarantine' && (
                            <span className="flex items-center gap-1.5 text-xs text-orange-600 font-bold uppercase tracking-tight">
                              <AlertCircle className="w-3.5 h-3.5" /> Quarantine
                            </span>
                          )}
                          {log.status === 'Virus' && (
                            <span className="flex items-center gap-1.5 text-xs text-red-600 font-bold uppercase tracking-tight">
                              <ShieldAlert className="w-3.5 h-3.5" /> Virus
                            </span>
                          )}
                          {(log.status === 'Clean' || log.status === 'Delivered') && (
                            <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold uppercase tracking-tight">
                              <CheckCircle className="w-3.5 h-3.5" /> Delivered
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{log.status}</span>
                        </div>
                      </td>

                      {/* Spam Score */}
                      <td className="p-4 align-top">
                        <span className={`font-mono font-medium ${parseFloat(log.sa_score) > 3 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {log.sa_score}
                        </span>
                      </td>

                      {/* Sender */}
                      <td className="p-4 align-top break-all">
                        <div className="text-gray-800 text-xs">{log.sender}</div>
                      </td>

                      {/* Receiver */}
                      <td className="p-4 align-top break-all">
                        <div className="text-gray-800 text-xs">{log.receiver}</div>
                      </td>

                      {/* Subject */}
                      <td className="p-4 align-top min-w-[200px]">
                        <div className="text-gray-700 line-clamp-2">{log.subject}</div>
                      </td>

                      {/* Client IP */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="text-gray-600 font-mono text-xs bg-gray-50 px-2 py-1 rounded inline-block">
                          {log.client_ip}
                        </div>
                      </td>

                      {/* Virus Info (Icon + Tooltip) */}
                      <td className="p-4 align-top text-center">
                        {log.virus_info ? (
                          <div className="flex justify-center" title={log.virus_info}>
                            <Bug className="w-4 h-4 text-red-500 hover:text-red-700 cursor-help transition-colors" />
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      {/* Direction */}
                      <td className="p-4 align-top text-center">
                        {log.direction === 'Incoming' ? (
                            <div title="Incoming" className="inline-flex justify-center items-center w-6 h-6 rounded bg-blue-50 text-blue-600">
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </div>
                        ) : (
                            <div title="Outgoing" className="inline-flex justify-center items-center w-6 h-6 rounded bg-purple-50 text-purple-600">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {logs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No logs found matching your criteria.
                </div>
              )}
            </div>
            
            {/* Footer / Pagination Mock */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 bg-gray-50 rounded-b">
              <span>Displaying {logs.length} of {logs.length} items</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
                <button className="px-2 py-1 border border-gray-300 rounded bg-prox-green text-white">1</button>
                <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>

          </div>
        ) : currentView === 'bwlist' ? (
          /* Advanced Black/White Lists View */
          <BWList />
        ) : (
          /* DLP Filters View */
          <DLPList />
        )}
      </div>

      <LogModal log={selectedLog} onClose={closeModal} />
    </div>
  );
};

export default App;

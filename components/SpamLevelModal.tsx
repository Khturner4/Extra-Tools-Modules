
import React from 'react';
import { LogEntry } from '../types';
import { X, Activity } from 'lucide-react';

interface SpamLevelModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

// Mock dictionary to simulate the detailed descriptions and scores
const RULE_DEFINITIONS: Record<string, { score: number; description: string }> = {
  'WORLDPOSTA_DQS_CLEAN': { score: -1.0, description: 'Spamhaus DQS verified sender as clean (not in any blacklists)' },
  'WORLDPOSTA_RSPAMD_DMARC_PASS': { score: -0.5, description: 'Rspamd confirmed DMARC/DKIM authentication pass' },
  'WORLDPOSTA_RSPAMD_PROCESSED': { score: -0.1, description: 'Email processed by Rspamd security analysis' },
  'HTML_MESSAGE': { score: 0.001, description: 'HTML included in message' },
  'HEADER_FROM_DIFFERENT_DOMAINS': { score: 0.249, description: 'From and EnvelopeFrom 2nd level mail domains are different' },
  'KAM_MXURI': { score: 1.5, description: '-' },
  'PDS_OTHER_BAD_TLD': { score: 1.999, description: 'Untrustworthy TLDs' },
  'WORLDPOSTA_AI_SPAM': { score: 3.0, description: 'AI daemon says: spam' },
  'KAM_SOMETLD_ARE_BAD_TLD': { score: 5.0, description: '-' },
  'FREEMAIL_ENVFROM_END_DIGIT': { score: 0.25, description: 'Envelope From ends in digit from freemail provider' },
  'FREEMAIL_FROM': { score: 0.0, description: 'Message is from a free email provider' },
  'WORLDPOSTA_AI_HAM': { score: -2.0, description: 'AI daemon says: ham (clean)' },
  'HTML_FONT_LOW_CONTRAST': { score: 0.5, description: 'HTML text has low contrast' },
  'MIME_HTML_ONLY': { score: 0.1, description: 'Message only contains HTML part' },
  'SPF_SOFTFAIL': { score: 1.0, description: 'SPF verification failed (softfail)' },
  'DKIM_SIGNED': { score: -0.1, description: 'Message is DKIM signed' },
  'Heuristics.Phishing.Email.SpoofedDomain': { score: 8.0, description: 'Phishing heuristic: Spoofed domain detected' },
  'DKIM_VALID': { score: -0.1, description: 'DKIM signature is valid' },
  'SPF_PASS': { score: -0.1, description: 'SPF verification passed' },
};

export const SpamLevelModal: React.FC<SpamLevelModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  // Handler to close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hitsData = log.sa_hits.map(hit => {
    const def = RULE_DEFINITIONS[hit] || { score: 0.1, description: '-' };
    return { name: hit, ...def };
  });

  const totalScore = parseFloat(log.sa_score.split('/')[0]);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-prox-green" />
            Spam Level Analysis
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-white p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between text-sm">
           <div className="flex items-center gap-4">
             <div>
               <span className="text-gray-500 font-medium block text-xs uppercase">Total Score</span>
               <span className={`text-2xl font-bold ${totalScore > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                 {totalScore.toFixed(3)}
               </span>
             </div>
             <div className="h-8 w-px bg-gray-200"></div>
             <div>
               <span className="text-gray-500 font-medium block text-xs uppercase">Subject</span>
               <span className="text-gray-800 font-medium line-clamp-1 max-w-md" title={log.subject}>{log.subject}</span>
             </div>
           </div>
           
           <div className="text-right">
             <div className="text-xs text-gray-500">From: <span className="text-gray-800 font-medium">{log.sender}</span></div>
             <div className="text-xs text-gray-500">To: <span className="text-gray-800 font-medium">{log.receiver}</span></div>
           </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-xs font-bold text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <div className="col-span-6 p-3">Test Name</div>
          <div className="col-span-2 p-3 text-right">Score</div>
          <div className="col-span-4 p-3">Description</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1">
          {hitsData.map((hit, idx) => {
            const isPositive = hit.score > 0;
            const rowClass = isPositive 
              ? 'bg-red-50/30 hover:bg-red-50/60' 
              : 'bg-blue-50/30 hover:bg-blue-50/60';
            const textClass = isPositive ? 'text-red-700' : 'text-blue-700';
            const scoreClass = isPositive ? 'text-red-600' : 'text-blue-600';
            
            return (
              <div key={idx} className={`grid grid-cols-12 text-sm border-b border-gray-100 transition-colors ${rowClass}`}>
                <div className={`col-span-6 p-3 font-mono text-xs flex items-center ${textClass} break-all`}>
                  {hit.name}
                </div>
                <div className={`col-span-2 p-3 text-right font-mono font-bold ${scoreClass}`}>
                  {hit.score}
                </div>
                <div className="col-span-4 p-3 text-xs flex items-center text-gray-600">{hit.description}</div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
           <button 
             onClick={onClose}
             className="bg-prox-green hover:bg-prox-green-dark text-white px-4 py-2 rounded shadow-sm text-sm font-semibold transition-colors"
           >
             Close
           </button>
        </div>

      </div>
    </div>
  );
};



export type View = 'dashboard' | 'logs' | 'bwlist' | 'dlp';

export interface LogEntry {
  id: string;
  time: string;
  client_ip: string;
  client_hostname: string;
  message_id: string;
  logid: string;
  sa_score: string;
  sa_hits: string[];
  processing_time_ms: number;
  spam_time: number;
  clam_time: number;
  custom_time: number;
  direction: 'Incoming' | 'Outgoing';
  status: 'Spam Quarantine' | 'Clean' | 'Virus' | 'Delivered' | 'Rejected';
  sender: string;
  receiver: string;
  subject: string;
  virus_info?: string;
}

export interface FilterState {
  domain: string;
  status: string;
  direction: string;
  subject: string;
  sender: string;
  receiver: string;
  virusInfo: string;
  fromDate: string;
  toDate: string;
}

export interface BWRule {
  id: string;
  domain: string; // Tenant domain
  type: 'Allow' | 'Block' | 'SPF Whitelist';
  direction: 'Incoming' | 'Outgoing' | 'Both';
  items: string[]; // External domains/emails
  updatedAt: string;
  updatedBy: string;
  reason?: string;
}

export interface DLPFilter {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  template: string; // The built-in name OR the custom pattern
  description?: string;
  keywords: string[];
  caseSensitive: boolean;
  updatedAt: string;
  notes?: string;
  domains: string[]; // Tenant domains
  items: string[]; // External domains/emails/IPs
  direction: 'Incoming' | 'Outgoing';
}
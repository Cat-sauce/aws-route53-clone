export interface HostedZone {
  id: string;
  name: string;
  comment?: string;
  zone_type: 'PUBLIC' | 'PRIVATE';
  record_count: number;
  created_at: string;
}

export interface DNSRecord {
  id: string;
  hosted_zone_id: string;
  name: string;
  type: string;
  ttl: number;
  records: string[];
  routing_policy: string;
  weight?: number | null;
  created_at: string;
}
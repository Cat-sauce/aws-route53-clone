const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchHostedZones(search?: string) {
  const url = new URL(`${API_BASE}/api/hosted-zone`);
  if (search) url.searchParams.set('search', search);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hosted zones');
  return res.json();
}

export async function createHostedZone(payload: { name: string; comment?: string; zone_type: string }) {
  const res = await fetch(`${API_BASE}/api/hosted-zone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create hosted zone');
  }
  return res.json();
}

export async function deleteHostedZone(id: string) {
  const res = await fetch(`${API_BASE}/api/hosted-zone/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete hosted zone');
}

export async function fetchZoneRecords(zoneId: string, search?: string, recordType?: string) {
  const url = new URL(`${API_BASE}/api/hosted-zone/${zoneId}/records`);
  if (search) url.searchParams.set('search', search);
  if (recordType) url.searchParams.set('record_type', recordType);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
}

export async function createRecord(
  zoneId: string,
  payload: {
    name: string;
    type: string;
    ttl: number;
    records: string[];
    routing_policy?: string;
    weight?: number | null;
  }
) {
  const res = await fetch(`${API_BASE}/api/hosted-zone/${zoneId}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create record');
  }
  return res.json();
}

export async function deleteRecord(zoneId: string, recordId: string) {
  const res = await fetch(`${API_BASE}/api/hosted-zone/${zoneId}/records/${recordId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete record');
}
const PRODUCTION_BACKEND = 'https://aws-route53-clone-gctk.onrender.com';

function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.replace(/\/+$/, '');
  }
  return PRODUCTION_BACKEND;
}

const API_BASE = getApiBase();

function buildUrl(path: string, params?: Record<string, string | undefined>): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE.startsWith('http') ? API_BASE : PRODUCTION_BACKEND;
  
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    }
  }

  const query = searchParams.toString();
  return query ? `${base}${cleanPath}?${query}` : `${base}${cleanPath}`;
}

export async function fetchHostedZones(search?: string) {
  const url = buildUrl('/api/hosted-zone', { search });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hosted zones');
  return res.json();
}

export async function createHostedZone(payload: { name: string; comment?: string; zone_type: string }) {
  const url = buildUrl('/api/hosted-zone');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create hosted zone');
  }
  return res.json();
}

export async function deleteHostedZone(id: string) {
  const url = buildUrl(`/api/hosted-zone/${id}`);
  const res = await fetch(url, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete hosted zone');
}

export async function fetchZoneRecords(zoneId: string, search?: string, recordType?: string) {
  const url = buildUrl(`/api/hosted-zone/${zoneId}/records`, {
    search,
    record_type: recordType,
  });
  const res = await fetch(url, { cache: 'no-store' });
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
  const url = buildUrl(`/api/hosted-zone/${zoneId}/records`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create record');
  }
  return res.json();
}

export async function deleteRecord(zoneId: string, recordId: string) {
  const url = buildUrl(`/api/hosted-zone/${zoneId}/records/${recordId}`);
  const res = await fetch(url, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete record');
}
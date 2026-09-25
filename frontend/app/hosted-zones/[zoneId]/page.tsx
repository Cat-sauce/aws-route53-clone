'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Download,
  ExternalLink,
  X
} from 'lucide-react';
import { fetchZoneRecords, createRecord, deleteRecord } from '@/lib/api';
import { DNSRecord } from '@/lib/types';

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'PTR', 'SRV', 'CAA'];

export default function ZoneRecordsPage() {
  const params = useParams();
  const zoneId = params?.zoneId as string;

  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'details'>('records');

  // Creation Drawer State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [isAlias, setIsAlias] = useState(false);
  const [recordTtl, setRecordTtl] = useState(300);
  const [recordValues, setRecordValues] = useState('');
  const [routingPolicy, setRoutingPolicy] = useState('Simple');
  const [recordWeight, setRecordWeight] = useState<number | ''>('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Derive zone name from seeded zone apex SOA or first record
  const zoneApex = records.find((r) => r.type === 'SOA')?.name || 'example.com.';

  const loadRecords = async () => {
    if (!zoneId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchZoneRecords(zoneId, search, typeFilter);
      setRecords(data);
      if (selectedRecordId && !data.some((r: DNSRecord) => r.id === selectedRecordId)) {
        setSelectedRecordId(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [zoneId, search, typeFilter]);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedValues = recordValues
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);

    if (parsedValues.length === 0) {
      setError('Please provide at least one record value.');
      return;
    }

    // Construct full name with zone apex
    let fullName = subdomain.trim();
    if (!fullName) {
      fullName = zoneApex;
    } else {
      if (!fullName.endsWith('.')) {
        fullName = `${fullName}.${zoneApex}`;
      }
    }

    try {
      setCreating(true);
      setError(null);
      await createRecord(zoneId, {
        name: fullName,
        type: recordType,
        ttl: isAlias ? 0 : Number(recordTtl),
        records: parsedValues,
        routing_policy: routingPolicy,
        weight: routingPolicy === 'Weighted' && recordWeight !== '' ? Number(recordWeight) : null,
      });

      setSuccessMsg(`Record set ${fullName} created successfully.`);
      setIsCreateOpen(false);
      setSubdomain('');
      setRecordValues('');
      setRecordTtl(300);
      setIsAlias(false);
      setRecordWeight('');
      loadRecords();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecordId) return;
    const rec = records.find((r) => r.id === selectedRecordId);
    if (!rec) return;

    if (rec.type === 'SOA') {
      setError('The default SOA record cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the record set "${rec.name}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await deleteRecord(zoneId, selectedRecordId);
      setSuccessMsg('Record set deleted successfully.');
      setSelectedRecordId(null);
      loadRecords();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const exportBindFile = () => {
    if (records.length === 0) return;
    let bindText = `; BIND zone file for zone ${zoneId}\n$TTL 300\n\n`;
    records.forEach((r) => {
      r.records.forEach((val) => {
        bindText += `${r.name.padEnd(30)} ${r.ttl.toString().padEnd(8)} IN  ${r.type.padEnd(8)} ${val}\n`;
      });
    });

    const blob = new Blob([bindText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${zoneId}-bind.zone`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedRecord = records.find((r) => r.id === selectedRecordId);

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto">
      {/* AWS Breadcrumbs */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#0972d3] hover:underline">Route 53</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/" className="hover:text-[#0972d3] hover:underline">Hosted zones</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-mono text-gray-800 font-medium">{zoneId}</span>
      </div>

      {/* Header Info */}
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl font-bold text-[#161e2e]">Hosted zone details</h1>
        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
          <span>Zone ID: <strong className="font-mono text-gray-900">{zoneId}</strong></span>
          <span>•</span>
          <span>Domain: <strong className="font-mono text-gray-900">{zoneApex}</strong></span>
        </div>
      </div>

      {/* CloudScape Tabs Header */}
      <div className="flex border-b border-gray-300 text-xs font-semibold space-x-6">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-2.5 transition border-b-2 ${
            activeTab === 'records'
              ? 'border-[#0972d3] text-[#0972d3]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Records ({records.length})
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 transition border-b-2 ${
            activeTab === 'details'
              ? 'border-[#0972d3] text-[#0972d3]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Hosted zone details
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {activeTab === 'records' ? (
        <div className="space-y-4">
          {/* Main Action Bar Card */}
          <div className="bg-white border border-gray-200 rounded shadow-xs">
            <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-white">
              {/* Search & Filter Controls */}
              <div className="flex items-center space-x-2 w-full md:w-auto flex-1 max-w-lg">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by record name"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#0972d3] focus:outline-none"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="py-1.5 px-2 text-xs border border-gray-300 rounded bg-white text-gray-700 focus:border-[#0972d3] focus:outline-none"
                >
                  <option value="">All types</option>
                  {RECORD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <button 
                  onClick={loadRecords} 
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                  title="Refresh records"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={exportBindFile}
                  className="px-3 py-1.5 rounded font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export zone file</span>
                </button>

                <button
                  onClick={handleDeleteRecord}
                  disabled={!selectedRecordId || deleting}
                  className={`px-3 py-1.5 rounded font-semibold border flex items-center space-x-1.5 ${
                    selectedRecordId
                      ? 'border-gray-400 bg-white text-gray-800 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete record</span>
                </button>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-3.5 py-1.5 rounded font-semibold bg-[#ec7211] hover:bg-[#eb5f07] text-white flex items-center space-x-1.5 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create record</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f2f3f3] text-gray-600 border-b border-gray-200 select-none uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="w-10 px-3 py-2.5 text-center"></th>
                    <th className="px-4 py-2.5">Record name</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Routing policy</th>
                    <th className="px-4 py-2.5">Weight</th>
                    <th className="px-4 py-2.5">TTL (seconds)</th>
                    <th className="px-4 py-2.5">Value/Route traffic to</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading && records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0972d3]" />
                        Loading records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        No records match the current filters.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => {
                      const isSelected = selectedRecordId === r.id;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedRecordId(r.id)}
                          className={`hover:bg-[#f2f8fd] cursor-pointer transition ${
                            isSelected ? 'bg-[#ebf5fe]' : ''
                          }`}
                        >
                          <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="selectedRecord"
                              checked={isSelected}
                              onChange={() => setSelectedRecordId(r.id)}
                              className="accent-[#0972d3] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-[#0972d3] font-mono">{r.name}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-[10px] font-bold border border-gray-300">
                              {r.type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">{r.routing_policy}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-600">{r.weight ?? '-'}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-600">{r.ttl}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-800 text-[11px]">
                            {r.records.map((val, idx) => (
                              <div key={idx} className="truncate max-w-lg">{val}</div>
                            ))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Table Summary Footer */}
            <div className="p-2.5 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
              <span>Showing {records.length} records</span>
              <div className="flex items-center space-x-1">
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Bottom Split Details Card for Selected Record */}
          {selectedRecord && (
            <div className="bg-white border border-gray-200 rounded p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  Record set details: <span className="font-mono text-[#0972d3]">{selectedRecord.name}</span>
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">ID: {selectedRecord.id}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-500 block">Record Type:</span>
                  <span className="font-bold text-gray-800 font-mono">{selectedRecord.type}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">TTL:</span>
                  <span className="font-bold text-gray-800 font-mono">{selectedRecord.ttl}s</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Routing Policy:</span>
                  <span className="font-bold text-gray-800">{selectedRecord.routing_policy}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Weight:</span>
                  <span className="font-bold text-gray-800 font-mono">{selectedRecord.weight ?? 'N/A'}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Route traffic to:</span>
                <div className="bg-gray-50 p-2.5 rounded font-mono text-[11px] border border-gray-200 space-y-1">
                  {selectedRecord.records.map((val, idx) => (
                    <div key={idx}>{val}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hosted Zone Details Tab */
        <div className="bg-white border border-gray-200 rounded p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Hosted zone configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-3.5 rounded bg-gray-50">
              <span className="text-gray-500 block text-[11px]">Hosted zone ID</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{zoneId}</span>
            </div>
            <div className="border p-3.5 rounded bg-gray-50">
              <span className="text-gray-500 block text-[11px]">Domain name</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{zoneApex}</span>
            </div>
            <div className="border p-3.5 rounded bg-gray-50">
              <span className="text-gray-500 block text-[11px]">Total Record sets</span>
              <span className="font-bold text-gray-900 font-mono text-sm">{records.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Record Modal Drawer */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-300 text-xs">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Quick create record</h3>
                <p className="text-[11px] text-gray-500">Specify DNS parameters and values to route traffic.</p>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRecord} className="p-5 space-y-4">
              {/* Record name with seamless right suffix badge */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Record name
                </label>
                <div className="flex rounded-md shadow-xs">
                  <input
                    type="text"
                    placeholder="e.g. api (or empty for root domain)"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l border border-gray-300 font-mono text-xs focus:border-[#0972d3] focus:outline-none"
                  />
                  <span className="inline-flex items-center px-3 rounded-r border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-mono text-xs select-none">
                    .{zoneApex.replace(/\.$/, '')}.
                  </span>
                </div>
              </div>

              {/* Alias Toggle Switch */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAlias}
                    onChange={(e) => setIsAlias(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0972d3]"></div>
                </label>
                <span className="font-semibold text-gray-700 text-xs">
                  Alias (route to AWS resource or another record)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Record type *</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 bg-white focus:border-[#0972d3] focus:outline-none font-semibold"
                  >
                    {RECORD_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">TTL (seconds) *</label>
                  <input
                    type="number"
                    required
                    disabled={isAlias}
                    min={0}
                    value={recordTtl}
                    onChange={(e) => setRecordTtl(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 font-mono focus:border-[#0972d3] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Value/Route traffic to * (one entry per line)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    recordType === 'A'
                      ? '192.0.2.1\n198.51.100.2'
                      : recordType === 'CNAME'
                      ? 'web.example.com.'
                      : '"sample-verification-token"'
                  }
                  value={recordValues}
                  onChange={(e) => setRecordValues(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 font-mono text-xs focus:border-[#0972d3] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Routing policy</label>
                  <select
                    value={routingPolicy}
                    onChange={(e) => setRoutingPolicy(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 bg-white focus:border-[#0972d3] focus:outline-none"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Weighted">Weighted</option>
                    <option value="Geolocation">Geolocation</option>
                    <option value="Latency">Latency</option>
                    <option value="Failover">Failover</option>
                  </select>
                </div>

                {routingPolicy === 'Weighted' && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Weight (0–255) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={255}
                      value={recordWeight}
                      onChange={(e) => setRecordWeight(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full border border-gray-300 rounded p-2 font-mono focus:border-[#0972d3] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white rounded font-semibold shadow-xs transition"
                >
                  {creating ? 'Creating...' : 'Create records'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
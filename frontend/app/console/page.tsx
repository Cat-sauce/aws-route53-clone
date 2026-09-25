'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  Plus, 
  ExternalLink,
  CheckCircle2, 
  AlertCircle, 
  X 
} from 'lucide-react';
import { fetchHostedZones, createHostedZone, deleteHostedZone } from '@/lib/api';
import { HostedZone } from '@/lib/types';

export default function HostedZonesConsolePage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [zoneType, setZoneType] = useState('PUBLIC');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHostedZones(search);
      setZones(data);
      if (selectedZoneId && !data.some((z: HostedZone) => z.id === selectedZoneId)) {
        setSelectedZoneId(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hosted zones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    let cleanName = name.trim().toLowerCase();
    if (!cleanName.endsWith('.')) {
      cleanName += '.';
    }

    try {
      setCreating(true);
      setError(null);
      await createHostedZone({
        name: cleanName,
        comment: comment.trim(),
        zone_type: zoneType,
      });
      setSuccessMsg(`Hosted zone ${cleanName} created successfully.`);
      setIsCreateOpen(false);
      setName('');
      setComment('');
      setZoneType('PUBLIC');
      loadZones();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedZoneId) return;
    const targetZone = zones.find((z) => z.id === selectedZoneId);
    if (!confirm(`Are you sure you want to delete hosted zone ${targetZone?.name || selectedZoneId}?`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await deleteHostedZone(selectedZoneId);
      setSuccessMsg('Hosted zone deleted successfully.');
      setSelectedZoneId(null);
      loadZones();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#0972d3] hover:underline">Route 53</Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-medium">Hosted zones</span>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl font-bold text-[#161e2e]">Hosted zones ({zones.length})</h1>
        <p className="text-xs text-gray-600 mt-1">
          A hosted zone contains records that specify how you want to route traffic for a domain.
        </p>
      </div>

      {/* Status Notifications */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded shadow-xs">
        {/* Controls Toolbar */}
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center space-x-2 w-full md:w-auto flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find hosted zone"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#0972d3] focus:outline-none"
              />
            </div>
            <button 
              onClick={loadZones} 
              className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
              title="Refresh hosted zones"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleDelete}
              disabled={!selectedZoneId || deleting}
              className={`px-3 py-1.5 rounded font-semibold border flex items-center space-x-1.5 transition ${
                selectedZoneId
                  ? 'border-gray-400 bg-white text-gray-800 hover:bg-gray-50'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-1.5 rounded font-semibold bg-[#ec7211] hover:bg-[#eb5f07] text-white flex items-center space-x-1.5 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create hosted zone</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f2f3f3] text-gray-600 border-b border-gray-200 select-none uppercase font-semibold text-[11px]">
              <tr>
                <th className="w-10 px-3 py-2.5 text-center"></th>
                <th className="px-4 py-2.5">Hosted zone name</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Record count</th>
                <th className="px-4 py-2.5">Hosted zone ID</th>
                <th className="px-4 py-2.5">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading && zones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0972d3]" />
                    Loading hosted zones...
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No hosted zones found.
                  </td>
                </tr>
              ) : (
                zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  return (
                    <tr
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`hover:bg-[#f2f8fd] cursor-pointer transition ${
                        isSelected ? 'bg-[#ebf5fe]' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="radio"
                          name="selectedZone"
                          checked={isSelected}
                          onChange={() => setSelectedZoneId(zone.id)}
                          className="accent-[#0972d3] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-[#0972d3]">
                        <Link 
                          href={`/hosted-zones/${zone.id}`}
                          className="hover:underline flex items-center space-x-1 font-mono"
                        >
                          <span>{zone.name}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          zone.zone_type === 'PUBLIC'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {zone.zone_type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-700">{zone.record_count}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-600">{zone.id}</td>
                      <td className="px-4 py-2.5 text-gray-500">{zone.comment || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg border border-gray-300 text-xs">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm text-gray-900">Create hosted zone</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Domain name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. example.com"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-[#0972d3] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Production web application domain"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-[#0972d3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Type</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 bg-white text-xs focus:border-[#0972d3] focus:outline-none"
                >
                  <option value="PUBLIC">Public hosted zone</option>
                  <option value="PRIVATE">Private hosted zone for Amazon VPC</option>
                </select>
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
                  className="px-4 py-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white rounded font-semibold transition"
                >
                  {creating ? 'Creating...' : 'Create hosted zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
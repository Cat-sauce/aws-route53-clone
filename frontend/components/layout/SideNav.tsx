'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LayoutDashboard, ShieldCheck, Activity, Share2, Layers } from 'lucide-react';

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Hosted zones', href: '/', icon: Globe, active: pathname === '/' || pathname.startsWith('/hosted-zone') },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Mock' },
    { label: 'Traffic policies', href: '/traffic-policies', icon: Share2, badge: 'Coming soon' },
    { label: 'Health checks', href: '/health-checks', icon: Activity, badge: 'Coming soon' },
    { label: 'Resolver', href: '/resolver', icon: Layers, badge: 'Coming soon' },
    { label: 'Domains', href: '/domains', icon: ShieldCheck, badge: 'Coming soon' },
  ];

  return (
    <aside className="w-64 bg-[#f8f9fa] border-r border-[#eaeded] min-h-[calc(100vh-40px)] flex flex-col text-xs text-[#161e2e] select-none">
      <div className="p-3 border-b border-[#eaeded]">
        <h2 className="font-bold text-[#161e2e] text-sm">DNS Management</h2>
        <p className="text-[11px] text-gray-500">Amazon Route 53 Console</p>
      </div>

      <nav className="p-2 space-y-0.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <Link
              key={item.label}
              href={item.badge === 'Coming soon' ? '#' : item.href}
              className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition ${
                isActive
                  ? 'bg-amber-50 text-amber-900 font-semibold border-l-4 border-amber-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#eaeded] text-[11px] text-gray-400">
        Region: Global (Route 53)
      </div>
    </aside>
  );
}
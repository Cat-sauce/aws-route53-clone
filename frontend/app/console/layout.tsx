'use client';

import React from 'react';
import AwsTopNav from '@/components/layout/AwsTopNav';
import SideNav from '@/components/layout/SideNav';

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#161e2e]">
      <AwsTopNav />
      <div className="flex">
        <SideNav />
        <main className="flex-1 bg-[#fafafa] min-h-[calc(100vh-40px)] p-6 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Grid, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AwsTopNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="h-10 bg-[#161e2e] text-gray-200 text-xs flex items-center justify-between px-3 select-none z-50 sticky top-0 border-b border-black/40">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <Link href="/console" className="flex items-center space-x-1 font-bold text-white hover:text-amber-400 transition">
          <span className="text-amber-500 font-black tracking-wider">AWS</span>
          <span className="text-gray-300 font-medium ml-1">Route 53</span>
        </Link>

        <span className="text-gray-500">|</span>

        <button className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#232f3e] hover:bg-[#2d3a4b] text-gray-200 transition">
          <Grid className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-[11px]">Services</span>
        </button>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="flex-1 max-w-lg mx-4 hidden sm:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search for services, features, docs (Alt+S)"
            className="w-full bg-[#0d131f] text-gray-200 pl-8 pr-12 py-1 rounded text-xs border border-gray-700 focus:outline-none focus:border-amber-500 placeholder-gray-500"
          />
          <span className="absolute right-2 top-1.5 text-[10px] text-gray-500 bg-gray-800 px-1 rounded">Alt+S</span>
        </div>
      </div>

      {/* Right side: Global Indicators & Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-gray-300 font-semibold px-2 py-0.5 rounded hover:bg-[#232f3e] cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          <span>Global</span>
        </div>

        <button className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-[#232f3e]">
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* Dynamic User Profile or Sign-in Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1.5 text-gray-200 font-semibold px-2 py-1 rounded hover:bg-[#232f3e] transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.username} @ {user.accountId}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-[#232f3e] border border-gray-700 rounded shadow-xl py-2 z-50 text-xs text-gray-200">
                <div className="px-3 py-1.5 border-b border-gray-700">
                  <div className="font-bold text-white">{user.username}</div>
                  <div className="text-[11px] text-gray-400 font-mono">Account ID: {user.accountId}</div>
                  <div className="text-[10px] text-amber-400">{user.role}</div>
                </div>
                <Link href="/" className="block px-3 py-2 hover:bg-[#2d3a4b] text-gray-300">
                  Route 53 Marketing Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-red-900/50 text-red-300 flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/signin"
            className="px-3 py-1 bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold rounded text-[11px] transition shadow-xs"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
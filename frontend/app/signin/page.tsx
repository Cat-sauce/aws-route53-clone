'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

export default function AwsSignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [userType, setUserType] = useState<'root' | 'iam'>('iam');
  const [accountId, setAccountId] = useState('5829-1029-4412');
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('••••••••••••');
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      login(username, accountId);
      router.push('/console');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col justify-between font-sans text-xs text-gray-800">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-300 py-3 px-8 flex justify-between items-center shadow-xs">
        <Link href="/" className="flex items-center">
          <svg className="h-7 w-auto" viewBox="0 0 64 38" fill="none">
            <path d="M19.2 16.5C18.4 15.6 17.2 15.1 15.6 15.1C13.2 15.1 11.6 16.2 10.9 18.5H19.4C19.4 17.7 19.3 17 19.2 16.5ZM23.3 22.8H7.1C7.2 24.9 8.6 26.6 11.2 26.6C12.8 26.6 14.1 26 14.9 24.8L22.4 25.8C20.6 28.9 16.6 30.6 11.1 30.6C4.4 30.6 0 25.9 0 19C0 12.1 4.5 7.4 11.2 7.4C18.2 7.4 22.5 12.1 22.5 19C22.5 20.4 22.4 21.7 22.2 22.8H23.3Z" fill="#232F3E"/>
            <path d="M37.3 29.8L32.2 10.8L27.1 29.8H20.6L28.9 4.3H35.6L43.8 29.8H37.3Z" fill="#232F3E"/>
            <path d="M44.4 29.8L51.9 4.3H58.4L50.9 29.8H44.4Z" fill="#232F3E"/>
            <path d="M10.8 34.8C21.7 39 37.1 39.5 48.6 32.7L49.9 35.8C37.2 43.1 20.3 42.6 8.5 37.8L10.8 34.8Z" fill="#FF9900"/>
          </svg>
        </Link>
        <span className="text-gray-500">AWS Management Console</span>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-300 rounded shadow-md w-full max-w-md p-8 space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-500 mt-1">Access Amazon Route 53 and all AWS services</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Account Selector Tabs */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  checked={userType === 'iam'}
                  onChange={() => setUserType('iam')}
                  className="accent-[#ec7211]"
                />
                <span className="font-semibold text-gray-800">IAM user</span>
                <span className="text-gray-500 text-[11px]">(Specify username & 12-digit account ID)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  checked={userType === 'root'}
                  onChange={() => setUserType('root')}
                  className="accent-[#ec7211]"
                />
                <span className="font-semibold text-gray-800">Root user</span>
                <span className="text-gray-500 text-[11px]">(Account owner email)</span>
              </label>
            </div>

            {userType === 'iam' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  AWS Account ID (12 digits)
                </label>
                <input
                  type="text"
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="1234-5678-9012"
                  className="w-full border border-gray-300 rounded p-2 font-mono text-xs focus:border-[#ec7211] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                {userType === 'iam' ? 'IAM user name' : 'Root user email address'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={userType === 'iam' ? 'e.g. Admin' : 'name@company.com'}
                className="w-full border border-gray-300 rounded p-2 text-xs focus:border-[#ec7211] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-xs focus:border-[#ec7211] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-[#ec7211] hover:bg-[#eb5f07] text-white font-bold rounded shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign in'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="border-t pt-4 text-center">
            <p className="text-gray-500 text-[11px]">New to Amazon Web Services?</p>
            <button
              onClick={() => {
                login('RootAdmin', '8910-4412-1029');
                router.push('/console');
              }}
              className="mt-2 w-full py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded text-gray-800 font-semibold transition"
            >
              Create a new AWS account (Demo Sign In)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-gray-300 text-gray-500 text-[11px] space-x-4">
        <span>© 2026, Amazon Web Services, Inc. or its affiliates.</span>
        <Link href="/" className="hover:underline">Privacy</Link>
        <Link href="/" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Amazon Route 53',
  description: 'Scalable DNS and Domain Name Registration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#fafafa]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
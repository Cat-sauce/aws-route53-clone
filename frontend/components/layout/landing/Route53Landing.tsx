'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronDown, 
  Globe, 
  Plus, 
  Minus, 
  ArrowRight, 
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';

export default function Route53Landing() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [openUseCase, setOpenUseCase] = useState<number | null>(0);

  const benefits = [
    {
      title: "Route end users to your site reliably with globally-dispersed Domain Name System (DNS) servers and automatic scaling.",
      content: "Amazon Route 53 is built using AWS's highly available and scalable infrastructure. The globally distributed nature of our DNS servers helps ensure a consistent ability to route your end users to your application."
    },
    {
      title: "Set up your DNS routing in minutes with domain name registration and straightforward visual traffic flow tools.",
      content: "Configure DNS settings with simple management tools, purchase and manage domain names, and automatically configure DNS settings for your domains with ease."
    },
    {
      title: "Customize your DNS routing policies to reduce latency, improve application availability, and maintain compliance.",
      content: "Route 53 offers a variety of routing policies including Latency Based Routing, Geo DNS, Geoproximity, and Weighted Round Robin to optimize application performance."
    }
  ];

  const useCases = [
    {
      title: "Manage network traffic globally",
      content: "Create, visualize, and scale complex routing relationships between records and policies with easy-to-use global DNS features."
    },
    {
      title: "Build highly available applications",
      content: "Set routing policies to pre-determine and automate responses in case of failure, like redirecting traffic to alternative Availability Zones or Regions."
    },
    {
      title: "Set up private DNS",
      content: "Assign and access custom domain names in your Amazon Virtual Private Cloud (VPC). Use internal AWS resources and servers without exposing DNS data to the public Internet."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#161e2e] flex flex-col font-sans">
      {/* 1. Global Black Utility Header */}
      <header className="bg-[#161e2e] text-gray-300 text-xs py-2 px-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
          <Link href="/contact" className="hover:text-white transition">Contact us</Link>
          <Link href="/marketplace" className="hover:text-white transition">AWS Marketplace</Link>
          <span className="cursor-pointer hover:text-white flex items-center space-x-1">
            <span>Support</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="cursor-pointer hover:text-white flex items-center space-x-1">
            <span>My account</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </span>
          <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-[11px]">
            H
          </div>
        </div>
      </header>

      {/* 2. White Primary Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-8">
          {/* AWS Logo */}
          <Link href="/" className="flex items-center">
            <svg className="h-7 w-auto" viewBox="0 0 64 38" fill="none">
              <path d="M19.2 16.5C18.4 15.6 17.2 15.1 15.6 15.1C13.2 15.1 11.6 16.2 10.9 18.5H19.4C19.4 17.7 19.3 17 19.2 16.5ZM23.3 22.8H7.1C7.2 24.9 8.6 26.6 11.2 26.6C12.8 26.6 14.1 26 14.9 24.8L22.4 25.8C20.6 28.9 16.6 30.6 11.1 30.6C4.4 30.6 0 25.9 0 19C0 12.1 4.5 7.4 11.2 7.4C18.2 7.4 22.5 12.1 22.5 19C22.5 20.4 22.4 21.7 22.2 22.8H23.3Z" fill="#232F3E"/>
              <path d="M37.3 29.8L32.2 10.8L27.1 29.8H20.6L28.9 4.3H35.6L43.8 29.8H37.3Z" fill="#232F3E"/>
              <path d="M44.4 29.8L51.9 4.3H58.4L50.9 29.8H44.4Z" fill="#232F3E"/>
              <path d="M10.8 34.8C21.7 39 37.1 39.5 48.6 32.7L49.9 35.8C37.2 43.1 20.3 42.6 8.5 37.8L10.8 34.8Z" fill="#FF9900"/>
            </svg>
          </Link>

          <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-gray-700">
            <span className="hover:text-[#0972d3] cursor-pointer">re:Invent</span>
            <span className="hover:text-[#0972d3] cursor-pointer">Discover AWS</span>
            <span className="hover:text-[#0972d3] cursor-pointer">Products</span>
            <span className="hover:text-[#0972d3] cursor-pointer">Solutions</span>
            <span className="hover:text-[#0972d3] cursor-pointer">Pricing</span>
            <span className="hover:text-[#0972d3] cursor-pointer">Resources</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-9 pr-4 py-1.5 rounded-full border border-gray-300 text-xs focus:outline-none focus:border-[#0972d3] w-48"
            />
          </div>

          <Link
            href="/console"
            className="text-xs font-semibold text-gray-800 hover:text-[#0972d3] px-3 py-1.5 transition"
          >
            Sign in to console
          </Link>

          <Link
            href="/console"
            className="text-xs font-bold bg-[#161e2e] text-white hover:bg-black px-4 py-2 rounded-full transition shadow-xs"
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* 3. Floating Subnav Pill */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <span className="font-bold text-sm text-[#161e2e]">Amazon Route 53</span>
            <div className="flex items-center space-x-5 text-xs font-semibold">
              {['Overview', 'Features', 'Pricing', 'Resources', 'FAQs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-1 transition ${
                    activeTab === tab 
                      ? 'border-b-2 border-[#161e2e] text-[#161e2e]' 
                      : 'text-gray-600 hover:text-black border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/console"
            className="text-xs font-bold bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-2 rounded-full transition shadow-xs flex items-center space-x-1"
          >
            <span>Launch Route 53 Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-xs text-gray-500 mb-2">
          <span>Products</span> &gt; <span>Networking and Content Delivery</span> &gt; <span className="font-semibold text-gray-700">Amazon Route 53</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#161e2e] mb-3">
          Amazon Route 53 - DNS service
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mb-6">
          A reliable and cost-effective way to route end users to Internet applications.
        </p>
        <div className="flex items-center space-x-3">
          <Link
            href="/console"
            className="px-5 py-2.5 bg-[#161e2e] hover:bg-black text-white text-xs font-bold rounded-full transition"
          >
            Get started with Route 53
          </Link>
          <button className="px-5 py-2.5 border border-gray-400 hover:border-black text-[#161e2e] text-xs font-bold rounded-full transition">
            Connect with an expert
          </button>
        </div>
      </section>

      {/* 5. Benefits of Route 53 (Two-column layout) */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold text-[#161e2e]">Benefits of Route 53</h2>
          </div>
          <div className="md:col-span-8 space-y-4">
            {benefits.map((b, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div key={idx} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-[#161e2e] hover:text-[#0972d3] transition py-1"
                  >
                    <span>{b.title}</span>
                    <span className="ml-4 text-gray-500 shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs text-gray-600 mt-2.5 leading-relaxed pl-1">
                      {b.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. How it Works */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold text-[#161e2e]">How it works</h2>
          </div>
          <div className="md:col-span-8 text-xs text-gray-600 leading-relaxed space-y-4">
            <p>
              Amazon Route 53 provides highly available and scalable <strong className="text-[#0972d3]">Domain Name System (DNS)</strong>, domain name registration, and health-checking cloud services. It is designed to give developers and businesses an extremely reliable and cost-effective way to route end users to internet applications by translating human-readable names like example.com into numeric IP addresses.
            </p>
            <p>
              In addition, Route 53 Resolver provides a regional recursive DNS service that performs recursive lookups for public names across the internet and internal AWS VPC resources.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Use Cases */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-bold text-[#161e2e]">Use cases</h2>
          </div>
          <div className="md:col-span-8 space-y-4">
            {useCases.map((u, idx) => {
              const isOpen = openUseCase === idx;
              return (
                <div key={idx} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setOpenUseCase(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-[#161e2e] hover:text-[#0972d3] transition py-1"
                  >
                    <span>{u.title}</span>
                    <span className="ml-4 text-gray-500 shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs text-gray-600 mt-2.5 leading-relaxed pl-1">
                      {u.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Customers Section (Rich Graphic Cards) */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-[#161e2e] mb-6">Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Capital One */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white min-h-[340px] flex flex-col justify-end p-8 shadow-md group">
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            <div className="relative z-10 space-y-3">
              <div className="text-red-500 font-extrabold text-2xl tracking-wider">
                Capital<span className="text-blue-400">One</span>
              </div>
              <h3 className="text-xl font-bold leading-tight">
                Capital One improves cloud resilience with Amazon Route 53
              </h3>
              <div className="flex items-center space-x-1 text-xs font-semibold text-gray-200 group-hover:text-white">
                <span>Read customer story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: McDonald's */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#a67c1e] to-[#2c220f] text-white min-h-[340px] flex flex-col justify-end p-8 shadow-md group">
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            <div className="relative z-10 space-y-3">
              <div className="text-yellow-400 font-extrabold text-3xl">M</div>
              <h3 className="text-xl font-bold leading-tight">
                McDonald's manages global traffic routing with Amazon Route 53
              </h3>
              <div className="flex items-center space-x-1 text-xs font-semibold text-gray-200 group-hover:text-white">
                <span>Watch the video</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Get Started Visual Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-[#161e2e] mb-6">Get started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/console" className="p-6 rounded-2xl bg-gradient-to-b from-[#0c2340] to-[#040e1a] text-white hover:scale-[1.02] transition shadow-md flex flex-col justify-between h-56">
            <span className="text-[10px] tracking-wider font-mono uppercase bg-white/20 px-2 py-0.5 rounded w-max">Pricing</span>
            <div>
              <h4 className="font-bold text-sm mb-1">Learn more about Amazon Route 53 pricing</h4>
              <ArrowRight className="w-4 h-4 text-blue-400 mt-2" />
            </div>
          </Link>

          <Link href="/console" className="p-6 rounded-2xl bg-gradient-to-b from-[#87201c] to-[#360807] text-white hover:scale-[1.02] transition shadow-md flex flex-col justify-between h-56">
            <span className="text-[10px] tracking-wider font-mono uppercase bg-white/20 px-2 py-0.5 rounded w-max">Getting started</span>
            <div>
              <h4 className="font-bold text-sm mb-1">Sign up for a free AWS account</h4>
              <ArrowRight className="w-4 h-4 text-red-300 mt-2" />
            </div>
          </Link>

          <Link href="/console" className="p-6 rounded-2xl bg-gradient-to-b from-[#113a36] to-[#061817] text-white hover:scale-[1.02] transition shadow-md flex flex-col justify-between h-56">
            <span className="text-[10px] tracking-wider font-mono uppercase bg-white/20 px-2 py-0.5 rounded w-max">Console</span>
            <div>
              <h4 className="font-bold text-sm mb-1">Start building in the Route 53 console</h4>
              <ArrowRight className="w-4 h-4 text-emerald-300 mt-2" />
            </div>
          </Link>

          <Link href="/contact" className="p-6 rounded-2xl bg-gradient-to-b from-[#4d1f5e] to-[#1c0724] text-white hover:scale-[1.02] transition shadow-md flex flex-col justify-between h-56">
            <span className="text-[10px] tracking-wider font-mono uppercase bg-white/20 px-2 py-0.5 rounded w-max">Support</span>
            <div>
              <h4 className="font-bold text-sm mb-1">Connect with an AWS sales expert</h4>
              <ArrowRight className="w-4 h-4 text-purple-300 mt-2" />
            </div>
          </Link>
        </div>
      </section>

      {/* 10. Feedback Banner */}
      <section className="max-w-6xl mx-auto px-6 py-6 w-full">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm">Did you find what you were looking for today?</h4>
            <p className="text-xs text-blue-100 mt-0.5">Let us know so we can improve the quality of the content on our pages</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-[#161e2e] hover:bg-black px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes</span>
            </button>
            <button className="bg-[#161e2e] hover:bg-black px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition">
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>No</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Dark AWS Mega Footer */}
      <footer className="bg-[#161e2e] text-white mt-12 pt-12 pb-8 px-6 text-xs">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-gray-800 pb-6">
            <Link href="/console" className="px-5 py-2 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition">
              Create an AWS account
            </Link>
            <div className="flex items-center space-x-2 text-gray-400 cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-400">
            <div>
              <h5 className="font-bold text-white mb-3">Learn</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">What is Cloud Computing?</Link></li>
                <li><Link href="/" className="hover:underline">AWS Route 53 Basics</Link></li>
                <li><Link href="/" className="hover:underline">DNS Security (DNSSEC)</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Resources</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Getting Started Resource Center</Link></li>
                <li><Link href="/" className="hover:underline">AWS Documentation</Link></li>
                <li><Link href="/" className="hover:underline">Route 53 Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Developers</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Developer Center</Link></li>
                <li><Link href="/" className="hover:underline">SDKs & Tools</Link></li>
                <li><Link href="/" className="hover:underline">Route 53 REST API</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Help</h5>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link href="/" className="hover:underline">File a Support Ticket</Link></li>
                <li><Link href="/" className="hover:underline">Service Health Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-[11px] text-gray-500 flex flex-wrap justify-between items-center gap-4">
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Privacy</Link>
              <Link href="/" className="hover:underline">Site terms</Link>
              <Link href="/" className="hover:underline">Cookie preferences</Link>
            </div>
            <div>
              © 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
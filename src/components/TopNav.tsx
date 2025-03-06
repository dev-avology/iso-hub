import React from 'react';
import type { MenuItem } from '../types';
import { LogOut } from 'lucide-react';
export default function TopNav({ 
  items,
  onNavigate 
}: { 
  items: MenuItem[];
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <header className="bg-zinc-900 border-b border-yellow-400/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {items.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={item.href.startsWith('http') ? undefined : onNavigate}
                className="inline-flex items-center px-4 py-2 border-b-2 border-transparent hover:border-yellow-400 text-sm font-medium text-gray-300 hover:text-yellow-400"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </a>
            ))}
          </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-yellow-400/20">
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full"></div>
                  <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </button>
              <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-yellow-400/20 text-white ">
                
                <div className="relative">
                  <LogOut className='w-[20px] h-[20px] '/>
                </div>
              </button>
            </div>

        </div>
      </nav>
    </header>
  );
}
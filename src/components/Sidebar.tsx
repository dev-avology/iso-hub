import React from 'react';
import { Shield, FileText, Settings, Cpu, User } from 'lucide-react';

const categories = [
  // { name: 'Processors', icon: CreditCard },
  // { name: 'Gateways', icon: Router },
  // { name: 'Hardware/Equipment', icon: HardDrive },
  // { name: 'Internal', icon: Briefcase },
  // { name: 'Misc', icon: MoreHorizontal },
  { name: 'ISO-Residuals', icon: FileText, href: 'https://dev.tracerpos.com/' },
  { name: 'Settings', icon: Settings },
  { name: 'ISO-AI', icon: Cpu },
  { name: 'Users', icon: User, href: '/users' },



  // { name: 'Residuals', icon: FileText, href: 'https://dev.tracerpos.com/'  },
];

export default function Sidebar({ 
  open, 
  setOpen 
}: { 
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 shadow-lg transform border-r border-yellow-400/20
      ${open ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div className="text-xl font-bold text-white tracking-tight">
              ISO<span className="text-yellow-400">Hub</span>
            </div>
          </div>
          <div className="mt-1 text-center text-xs text-yellow-400/60">
            Secure Document Management
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            <h2 className="text-lg font-semibold text-white">Categories</h2>
            <nav className="mt-6">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={ category.href || `#${category.name.toLowerCase()}`}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-yellow-400 hover:bg-zinc-800"
                >
                  <category.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-yellow-400" />
                  {category.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Shield, FileText, Settings, Cpu, User, LogOut, File, Bell } from 'lucide-react';

import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const categories = [
  // { name: 'Processors', icon: CreditCard },
  // { name: 'Gateways', icon: Router },
  // { name: 'Hardware/Equipment', icon: HardDrive },
  // { name: 'Internal', icon: Briefcase },
  // { name: 'Misc', icon: MoreHorizontal },
  { name: 'ISO-Residuals', icon: FileText, href: 'https://dev.tracerpos.com/', external: true },
  { name: 'Settings', icon: Settings },
  { name: 'ISO-AI', icon: Cpu },
  { name: 'Admin', icon: User, href: '/admin' },

  // { name: 'Users', icon: User, href: '/users' },




  // { name: 'Residuals', icon: FileText, href: 'https://dev.tracerpos.com/'  },
];

export default function Sidebar({ 
  open, 
  setOpen 
}: { 
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/$/, ''));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

        <div className="flex-1 overflow-y-auto relative">
          <div className="px-4 py-6">
            <h2 className="text-lg font-semibold text-white">Categories</h2>
            <nav className="mt-6 navi-links">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href || `#${category.name.toLowerCase()}`}
                  target={category.external ? "_blank" : undefined}
                  rel={category.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-yellow-400 hover:bg-zinc-800 relative group"
                >
                  <category.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-yellow-400" />
                  {category.name}
                  {category.name === "Admin" && (
                  <ul className="sub_menu absolute top-[102%] left-0 w-full bg-zinc-800 px-2 z-[9] py-5 group rounded hidden hover:block group-hover:block ">
                    <li className="text-white">
                      <a href="/teammember" className='bg-black rounded-md flex py-2 px-3 gap-2 items-center text-md hover:bg-yellow-600' > <User className='w-5 h-5'/>Team Member</a>
                    </li>
                    <li className="text-white mt-2">
                      <a href="/vendor" className='bg-black rounded-md flex py-2 px-3 gap-2 items-center text-md hover:bg-yellow-600' > <User className='w-5 h-5'/> Vendor</a>
                    </li>
                    <li className="text-white mt-2">
                      <a href="/master_database_documents" className='bg-black rounded-md flex py-2 px-3 gap-2 items-center text-md hover:bg-yellow-600' > <File className='w-5 h-5'/> Documents</a>
                    </li>
                    <li className="text-white mt-2">
                      <a href="/all_reps" className='bg-black rounded-md flex py-2 px-3 gap-2 items-center text-md hover:bg-yellow-600' > <User className='w-5 h-5'/>  All Reps</a>
                    </li>
                    <li className="text-white mt-2">
                      <a href="/application_notifications" className='bg-black rounded-md flex py-2 px-3 gap-2 items-center text-md hover:bg-yellow-600' > <Bell className='w-5 h-5'/>  Notifications</a>
                    </li>
                  </ul>
                )}
                </a>
              ))}
            </nav>
          </div>
          <button 
            onClick={handleLogout}
            className='absolute bottom-5 left-[50%] translate-x-[-50%] w-[90%] bg-yellow-400 rounded py-3 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
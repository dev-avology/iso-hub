import React from 'react';
import { LayoutDashboard, Key, FileText, FormInput, Shield, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const topMenuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  // { name: 'Residuals', href: 'https://dev.tracerpos.com/', icon: FileText },
  { name: 'Logins', href: '/logins', icon: Key },
  { name: 'Document Center', href: '/documents', icon: FileText },
  { name: 'Pre-Applications', href: '/applications', icon: FormInput },
  { name: 'Secured Doc Portal', href: '/secure', icon: Shield },
];


export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <button
            className="fixed top-4 left-4 p-2 rounded-md bg-zinc-900 shadow-lg border border-yellow-400/20"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-yellow-400" />
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav items={topMenuItems} onNavigate={handleNavigation} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
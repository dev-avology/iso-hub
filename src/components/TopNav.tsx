import React, { useEffect, useState } from 'react';
import type { MenuItem } from '../types';
import { LogOut, Megaphone } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

export default function TopNav({
  items,
  onNavigate
}: {
  items: MenuItem[];
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [userNotificationCount, setUserNotificationCount] = useState(0);
  const [adminNotification, setAdminNotification] = useState([]);
  const [userNotification, setUserNotification] = useState([]);

  const [isNotificationPath, setIsNotificationPath] = useState('');
  // Get role_id from auth_user in localStorage

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.role_id === 1 || parsedUser?.role_id === 2) {
        setIsNotificationPath('/application_notifications');
      } else {
        setIsNotificationPath('/user-notification');
      }
    }
  }, []);


  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const value = localStorage.getItem("auth_user");
      const parsedUser = value ? JSON.parse(value) : null;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/count/${parsedUser.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications..');
      }

      const data = await response.json();
      console.log(data,'get data');
      if (data.status === 'success') {
        setUserNotificationCount(data.count);
        setAdminNotification(data.admin_notifications);
        setUserNotification(data.user_notifications);
        console.log(data);
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  }

  const updateNotificationCount = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const value = localStorage.getItem("auth_user");
      const parsedUser = value ? JSON.parse(value) : null;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/remove-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id: parsedUser.id})
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications..');
      }

      const data = await response.json();
     
      // if (data.status === 'success') {
      //   // setUserNotificationCount(0);
      // } else {
      //   throw new Error(data.message || 'Failed to fetch');
      // }
    } catch (error) {
      console.error('Error update notification count:', error);
      toast.error('Failed to update notification count');
    }
  }

  useEffect(() => {
    fetchNotifications();
    const handleAnyClick = () => {
      fetchNotifications();
    };

    window.addEventListener('click', handleAnyClick);

    return () => {
      window.removeEventListener('click', handleAnyClick);
    };
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('http')) return false;
    return location.pathname === href;
  };

  return (
    <header className="bg-zinc-900 border-b border-yellow-400/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {items.map((item) => (
              item.href.startsWith('http') ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border-b-2 border-transparent hover:border-yellow-400 text-sm font-medium text-gray-300 hover:text-yellow-400 relative group"
                >
                  <item.icon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-yellow-400" />
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-4 py-2 mx-1 border-b-2 text-sm font-medium relative group transition-all
                    ${isActive(item.href)
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-300 hover:border-yellow-400 hover:text-yellow-400'}`}
                >
                  <item.icon className={`h-5 w-5 mr-2 ${isActive(item.href) ? 'text-yellow-400' : 'text-gray-400 group-hover:text-yellow-400'}`} />
                  {item.name}
                </Link>
              )
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link onClick={updateNotificationCount}
              to={isNotificationPath || '#'}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-yellow-400/20"
            >
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <div className="absolute -top-2 -right-1 h-4 w-4 bg-yellow-400 text-black text-[12px] font-bold flex items-center justify-center rounded-full">
                  {userNotificationCount}
                </div>
                <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-yellow-400/20 text-white hover:text-yellow-400 transition-colors"
            >
              <div className="relative">
                <LogOut className='w-[20px] h-[20px]' />
              </div>
            </button>
          </div>
        </div>
      </nav>

    </header>
  );
}
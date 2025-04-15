import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Notifications() {
  const [adminNotification, setAdminNotification] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
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
      if (data.status === 'success') {
        setAdminNotification(data.admin_notifications);
        console.log(data, 'data......');
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }finally{
      setIsLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error update notification count:', error);
      toast.error('Failed to update notification count');
    }
  }

  useEffect(() => {
    fetchNotifications();
    updateNotificationCount();
    console.log('this useeffect called');
  }, []);

  return (
    <>
      <div className="user_cont my-10">
        <div className="w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white py-5 px-5 rounded font-medium uppercase transition duration-200 block">
          All Notifications
        </div>
      </div>

      <div className="user_data_wrap mt-10">
       {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : adminNotification.length > 0 ? (
          adminNotification.map((item: any, index: number) => (
            <div
              key={index}
              className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4 mb-4"
            >
              <div className="w-[80%]">{item.message}</div>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-400">No notifications available</div>
        )}
      </div>

    </>
  );
}

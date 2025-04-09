import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Rep {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Rep[];
}

const UserReps: React.FC = () => {
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReps();
  }, []);

  const fetchReps = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const userId = authUser?.id;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reps/get-rep-list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      const data: ApiResponse = await response.json();
      console.log(data,'datass')
      if (data.status === 'success') {
        setReps(data.data);
      }
    } catch (error) {
      console.error('Error fetching reps:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">My Reps</h1>
      </div>

      <div className="bg-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-2 p-4 text-sm font-medium text-gray-400 border-b border-zinc-700">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Address</div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : reps.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No reps found</div>
        ) : (
          <div>
            {reps.map((rep) => (
              <div 
                key={rep.id}
                className="grid grid-cols-4 gap-2 p-4 text-sm text-gray-300 border-b border-zinc-700/50 hover:bg-zinc-700/50 group relative"
              >
                <div>{rep.name}</div>
                <div>{rep.email}</div>
                <div>{rep.phone}</div>
                <div>{rep.address}</div>
                {/* <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-2">
                  <Edit2 className="h-4 w-4 text-yellow-400 cursor-pointer hover:text-yellow-300" />
                  <Trash2 className="h-4 w-4 text-red-400 cursor-pointer hover:text-red-300" />
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReps; 
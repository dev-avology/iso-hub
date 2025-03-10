import { Edit, Trash, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface TeamMemberFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ApiResponse {
  message: string;
  team_members: TeamMember[];
}

export default function TeamMember() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchTeamMembers = async (id?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/team-member/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: id ? JSON.stringify({ id }) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data: ApiResponse = await response.json();
      setTeamMembers(data.team_members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMemberById = async (id: string) => {
    await fetchTeamMembers(id);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/team-member/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create team member');
      }

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      setIsModalOpen(false);
      
      // Refresh the team members list
      fetchTeamMembers();
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  return (
    <>
      <div className="user_cont my-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-5 rounded font-medium uppercase transition duration-200 block"
        >
          Add Team Member
        </button>
      </div>

      <div className="user_data_wrap">
        <div className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4">
          <div className="userData w-[20%] font-bold">Name</div>
          <div className="userData w-[20%] font-bold">Email</div>
          <div className="userData w-[20%] font-bold">Phone Number</div>
          <div className="userData w-[20%] font-bold">Address</div>
        </div>
      </div>

      <div className="user_body w-full text-white mt-5">
        {isLoading ? (
          <div className="text-center py-4">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-4">No team members found</div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="UserDataRow group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 hover:bg-gray-700 cursor-pointer relative"
            >
              <div className="userdata w-[20%]">{member.name}</div>
              <div className="userdata w-[20%]">{member.email}</div>
              <div className="userdata w-[20%]">{member.phone}</div>
              <div className="userdata w-[20%]">{member.address}</div>
              <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                <div className="edit_data flex gap-2 items-center">
                  <button className="hover:text-yellow-500">
                    <Edit />
                  </button>
                  <button className="hover:text-red-500">
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Team Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Add New Team Member</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-5 rounded font-medium uppercase transition duration-200"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

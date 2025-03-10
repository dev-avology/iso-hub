import { useState, ChangeEvent, FormEvent } from 'react';
import { Edit, Trash, X } from 'lucide-react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'manager',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'team lead',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'user',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'manager',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'team lead',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'user',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'manager',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'team lead',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'user',
  },
];

export default function Admin() {
  // State to track checkbox selections for each role filter
  const [managerChecked, setManagerChecked] = useState(false);
  const [teamLeadersChecked, setTeamLeadersChecked] = useState(false);
  const [usersChecked, setUsersChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user'
  });

  // Update handlers for each checkbox
  const handleManagerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setManagerChecked(e.target.checked);
  };

  const handleTeamLeadersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamLeadersChecked(e.target.checked);
  };

  const handleUsersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsersChecked(e.target.checked);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to add the user
    console.log('New user:', newUser);
    // Reset form and close modal
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user'
    });
    setIsModalOpen(false);
  };

  const currentUser = localStorage.getItem('auth_user');
  console.log('currentUser: ', currentUser);

  // Filter the users array based on checked roles.
  // If no checkboxes are selected, show all users.
  const filteredUsers = users.filter((user) => {
    if (!managerChecked && !teamLeadersChecked && !usersChecked) return true;
    if (managerChecked && user.role.toLowerCase() === 'manager') return true;
    if (teamLeadersChecked && user.role.toLowerCase() === 'team lead') return true;
    if (usersChecked && user.role.toLowerCase() === 'user') return true;
    return false;
  });

  return (
    <>
      <div className="shortmembers my-10 flex gap-7 items-center w-full text-center bg-yellow-500 py-5 px-5 rounded">
        <div className="short text-white font-medium flex items-center gap-2">
          <input
            type="checkbox"
            className="h-[20px] w-[20px]"
            onChange={handleManagerChange}
            checked={managerChecked}
          />
          <span>Manager</span>
        </div>
        <div className="short text-white font-medium flex items-center gap-2">
          <input
            type="checkbox"
            className="h-[20px] w-[20px]"
            onChange={handleTeamLeadersChange}
            checked={teamLeadersChecked}
          />
          <span>Team Leaders</span>
        </div>
        <div className="short text-white font-medium flex items-center gap-2">
          <input
            type="checkbox"
            className="h-[20px] w-[20px]"
            onChange={handleUsersChange}
            checked={usersChecked}
          />
          <span>Users</span>
        </div>
      </div>

      <div className="user_cont my-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-5 rounded font-medium uppercase transition duration-200 block"
        >
          Add User
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
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
                  value={newUser.email}
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
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="manager">Manager</option>
                  <option value="team lead">Team Lead</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-medium uppercase transition duration-200 mt-6"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="user_data_wrap">
        <div className="user_dataHead w-full px-5 py-4 rounded bg-gray-700 text-white flex gap-4">
          <div className="userData w-[20%] font-bold">First Name</div>
          <div className="userData w-[20%] font-bold">Last Name</div>
          <div className="userData w-[20%] font-bold">Email</div>
          <div className="userData w-[20%] font-bold">Phone Number</div>
          <div className="userData w-[20%] font-bold">Role</div>
        </div>
      </div>

      <div className="user_body w-full text-white mt-5">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="UserDataRow group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 hover:bg-gray-700 cursor-pointer relative"
          >
            <div className="userdata w-[20%]">{user.firstName}</div>
            <div className="userdata w-[20%]">{user.lastName}</div>
            <div className="userdata w-[20%]">{user.email}</div>
            <div className="userdata w-[20%]">{user.phone}</div>
            <div className="userdata w-[20%]">{user.role}</div>
            <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
              <div className="edit_data flex gap-2 items-center">
                <a href="/edituser" className="hover:text-yellow-500">
                  <Edit />
                </a>
                <button className="hover:text-red-500">
                  <Trash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

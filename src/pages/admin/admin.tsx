import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';

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

  // Update handlers for each checkbox
  const handleManagerChange = (e) => {
    setManagerChecked(e.target.checked);
  };

  const handleTeamLeadersChange = (e) => {
    setTeamLeadersChecked(e.target.checked);
  };

  const handleUsersChange = (e) => {
    setUsersChecked(e.target.checked);
  };

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
                <a href="javascript:void(0)" className="hover:text-red-500">
                  <Trash />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

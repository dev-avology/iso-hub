import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const UserRep: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sub_menu w-full px-2 z-[9] py-1 rounded">
      <ul>
        <li className="text-white mt-2 first:mt-0">
          <Link
            to="/user-reps"
            className={`flex py-2 px-3 gap-2 items-center text-md rounded-md transition-all
              ${
                location.pathname === '/user-reps'
                  ? 'bg-black border-l-4 border-yellow-400 text-yellow-400'
                  : 'bg-black hover:border-l-4 hover:border-yellow-400 hover:text-yellow-400'
              }`}
          >
            <UserPlus
              className={`w-5 h-5 ${
                location.pathname === '/user-reps' ? 'text-yellow-400' : ''
              }`}
            />
            My Rep Lists
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserRep;

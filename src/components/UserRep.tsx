import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const UserRep: React.FC = () => {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
        Rep
      </h3>
      <ul className="space-y-1">
        <li>
          <Link
            to="/user-reps"
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-3" />
            <span>My Rep lists</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserRep; 
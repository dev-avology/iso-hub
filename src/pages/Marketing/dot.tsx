import React, { useState } from 'react';
import { Edit, Download } from 'lucide-react';

export default function Marketing() {
  const [collapsed, setCollapsed] = useState(false);
  const socail = [
    { socailName: 'Facebook' },
    { socailName: 'Instagram' },
    { socailName: 'Twitter' },
    // add more items as needed...
  ];

  return (
    <div className="markiting-wrap">
      <h3
        className="text-white text-2xl font-bold cursor-pointer flex items-center justify-between"
        onClick={() => setCollapsed(!collapsed)}
      >
        Social Media
        <span className="ml-2 text-lg">
          {collapsed ? '▲' : '▼'}
        </span>
      </h3>
      {!collapsed && (
        <div>
          {socail.map((socailN, index) => (
            <div className="markiting-list-wrap" key={index}>
              <div className="markiting-list group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className="font-bold">{socailN.socailName}</h4>
                <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                  <div className="edit_data flex gap-2 items-center">
                    <a href="javascript:void(0)" className="hover:text-yellow-500">
                      <Edit />
                    </a>
                    <a href="javascript:void(0)" className="hover:text-yellow-500">
                      <Download />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

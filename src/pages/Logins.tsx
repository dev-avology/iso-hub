import React, { useState } from 'react';
import { Search, ExternalLink, ChevronDown, CreditCard, Router, HardDrive } from 'lucide-react';

// Sample data - in a real app, this would come from an API/database
const loginItems = {
  processors: [
    {
      name: 'First Data',
      logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=128&h=128&fit=crop',
      url: '#'
    },
    {
      name: 'TSYS',
      logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=128&h=128&fit=crop',
      url: '#'
    },
    {
      name: 'Global Payments',
      logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=128&h=128&fit=crop',
      url: '#'
    }
  ],
  gateways: [
    {
      name: 'Authorize.net',
      logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=128&h=128&fit=crop',
      url: '#'
    },
    {
      name: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=128&h=128&fit=crop',
      url: '#'
    }
  ],
  hardware: [
    {
      name: 'Clover',
      logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=128&h=128&fit=crop',
      url: '#'
    },
    {
      name: 'Verifone',
      logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=128&h=128&fit=crop',
      url: '#'
    }
  ]
};

const categories = [
  { id: 'processors', name: 'Processors', icon: CreditCard },
  { id: 'gateways', name: 'Gateways', icon: Router },
  { id: 'hardware', name: 'Hardware/Equipment', icon: HardDrive }
];

export default function Logins() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    processors: true,
    gateways: false,
    hardware: false
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const filterItems = (items: typeof loginItems.processors) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-black">Login Portal</h1>
            <p className="text-black/80 mt-1">
              Access all your processor, gateway, and vendor logins in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logins..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const items = filterItems(loginItems[category.id as keyof typeof loginItems]);
          const isOpen = openCategories[category.id];

          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900">
                    {category.name}
                    <span className="ml-2 text-sm text-gray-500">
                      ({items.length})
                    </span>
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="relative group bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.name}
                            </h3>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
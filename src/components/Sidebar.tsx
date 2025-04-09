import { Shield, FileText, Settings, Cpu, User, LogOut, File, Bell, FormInput, X, LayoutDashboard, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import UserRep from './UserRep';

interface Category {
  name: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
}

const nonAdminCategories: Category[] = [
  // { name: 'Processors', icon: CreditCard },
  // { name: 'Gateways', icon: Router },
  // { name: 'Hardware/Equipment', icon: HardDrive },
  // { name: 'Internal', icon: Briefcase },
  // { name: 'Misc', icon: MoreHorizontal },
  { name: 'ISO-Residuals', icon: FileText, href: 'https://dev.tracerpos.com/', external: true },
  { name: 'ISO-AI', icon: Cpu },
  { name: 'Settings', icon: Settings },
  // { name: 'Users', icon: User, href: '/users' },
  // { name: 'Residuals', icon: FileText, href: 'https://dev.tracerpos.com/'  },
];

const userRep = [
  {name: 'Reps',icon: Cpu}
];

const adminCategories = [
  ...nonAdminCategories,
  { name: 'Admin', icon: User, href: '/admin' },
];

const adminSubMenu = [
  { name: 'Team Member', icon: User, path: '/teammember' },
  { name: 'Vendor', icon: User, path: '/vendor' },
  { name: 'Documents', icon: File, path: '/master_database_documents' },
  { name: 'All Reps', icon: User, path: '/all_reps' },
  { name: 'Notifications', icon: Bell, path: '/application_notifications' },
  // { name: 'Forms', icon: FormInput, path: '/forms' },
];

export default function Sidebar({ 
  open, 
  setOpen 
}: { 
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role_id from auth_user in localStorage
  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const isAdmin = authUser?.role_id === 2;
  const isUser = authUser?.role_id === 5;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path || adminSubMenu.some(item => item.path === location.pathname);
    }
    return location.pathname === path;
  };

  
  const categories = isAdmin ? adminCategories : nonAdminCategories;
  console.log(categories,'categories');

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 shadow-lg transform border-r border-yellow-400/20
      ${open ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div className="text-xl font-bold text-white tracking-tight">
              ISO<span className="text-yellow-400">Hub</span>
            </div>
          </div>
          <div className="mt-1 text-center text-xs text-yellow-400/60">
            Secure Document Management
          </div>
        </div>

        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-white">Categories</h2>
          <nav className="mt-6 navi-links">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                {category.external ? (
                  <a
                    href={category.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-yellow-400 hover:border-l-4 hover:border-yellow-400 relative"
                  >
                    <category.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-yellow-400" />
                    {category.name}
                  </a>
                ) : (
                  <>
                    <Link
                      to={category.href || `/${category.name.toLowerCase()}`}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:text-yellow-400 relative transition-all
                        ${isActive(category.href || `/${category.name.toLowerCase()}`) 
                          ? 'text-yellow-400 border-l-4 border-yellow-400 pl-2' 
                          : 'text-gray-300 hover:border-l-4 hover:border-yellow-400'}`}
                    >
                      <category.icon className={`h-5 w-5 mr-3 ${isActive(category.href || `/${category.name.toLowerCase()}`) 
                        ? 'text-yellow-400' 
                        : 'text-gray-400 group-hover:text-yellow-400'}`} />
                      {category.name}
                    </Link>
                    
                    {category.name === 'Admin' && (
                      <div className={`sub_menu absolute top-full left-0 w-full bg-zinc-800 px-2 z-[9] py-5 rounded 
                        ${adminSubMenu.some(item => location.pathname === item.path) ? 'block' : 'hidden group-hover:block'}`}
                      >
                        <ul>
                          {adminSubMenu.map((item) => (
                            <li key={item.path} className="text-white mt-2 first:mt-0">
                              <Link 
                                to={item.path}
                                className={`flex py-2 px-3 gap-2 items-center text-md rounded-md transition-all
                                  ${location.pathname === item.path 
                                    ? 'bg-black border-l-4 border-yellow-400 text-yellow-400' 
                                    : 'bg-black hover:border-l-4 hover:border-yellow-400 hover:text-yellow-400'}`}
                              >
                                <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-yellow-400' : ''}`}/> 
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>

        {isUser && <UserRep />}

        <button 
          onClick={handleLogout}
          className='absolute bottom-5 left-[50%] translate-x-[-50%] w-[90%] bg-yellow-400 rounded py-3 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
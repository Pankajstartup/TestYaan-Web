import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
// Yahan logo import kiya gaya hai
import { logoData } from '../LogoData'; 

const Navbar = ({ user = { name: 'Admin', role: 'Pathology Lab' } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Registration', href: '/admin/registration', icon: UserPlus },
    { name: 'Orders/Billing', href: '/admin/orders', icon: FileText },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20"> {/* Height increased for brand feel */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo section updated for a professional brand look */}
              <Link to="/admin/dashboard" className="flex items-center gap-4 group transition-all">
                <div className="bg-white p-1.5 rounded-xl shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={logoData} 
                    alt="TestYaan Logo" 
                    className="h-12 w-auto object-contain" 
                    style={{ minWidth: '130px' }}
                  />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-slate-800 leading-none">
                    TEST<span className="text-blue-600">YAAN</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mt-1">
                    Pathology & Diagnostics
                  </span>
                </div>
                <span className="sr-only">TestYaan</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-semibold border-b-2 transition-colors ${
                      isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-500'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: Search, Notifications, Profile */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patient/order..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              />
            </div>
            
            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center p-1 bg-gray-50 rounded-full border border-gray-200 hover:border-blue-300 transition-all focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                  {user.name[0]}
                </div>
                <div className="hidden md:block text-left ml-3 mr-1">
                   <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                   <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{user.role}</p>
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            <button className="flex items-center text-gray-500 hover:text-red-600 text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Package, User as UserIcon, LogOut, Settings, Heart, X, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onLogoClick: () => void;
  user?: User;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onLogoClick, user, onLogout, onNavigate }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close dropdowns/search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // Only close search if it's empty, otherwise keep it so user doesn't lose text
        if (!searchQuery) {
            setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleMobileNav = (path: string) => {
    if (path.startsWith('/#')) {
        // Handle hash navigation
        window.location.hash = path.replace('/', '');
        if (window.location.pathname !== '/') {
             onNavigate('/');
        }
    } else {
        onNavigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleDesktopNav = (path: string) => {
     if (path.startsWith('/#')) {
         const hash = path.replace('/', '');
         if (window.location.pathname === '/') {
             // We are on home page, update hash to scroll
             window.location.hash = hash;
         } else {
             // Navigate to home with hash
             onNavigate(path); 
         }
     } else {
         onNavigate(path);
     }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-100 transition-all duration-300" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LEFT SECTION: Logo & Nav Links */}
          <div className="flex items-center h-full">
            {/* Logo */}
            <button 
              className="flex-shrink-0 flex items-center cursor-pointer group pr-2 focus:outline-none focus:ring-2 focus:ring-black rounded-lg p-1" 
              onClick={onLogoClick}
              aria-label="Go to Lumina Homepage"
            >
              <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center mr-2 transform group-hover:rotate-12 transition-transform" aria-hidden="true">
                <Package size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">LUMINA</span>
            </button>

            {/* Desktop Nav */}
            <div className={`hidden md:flex ml-[30px] space-x-8 items-center h-full transition-opacity duration-200 ${isSearchOpen ? 'lg:opacity-100 md:opacity-0' : 'opacity-100'}`}>
              <button 
                onClick={() => handleDesktopNav('/#shop')} 
                className="text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center h-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black rounded px-2"
              >
                Shop
              </button>
              <button 
                onClick={() => handleDesktopNav('/#collections')} 
                className="text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center h-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black rounded px-2"
              >
                Collections
              </button>
              <button 
                onClick={() => handleDesktopNav('/#footer')} 
                className="text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center h-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black rounded px-2"
              >
                About
              </button>
            </div>
          </div>

          {/* Spacer to push actions to right */}
          <div className="flex-1"></div>

          {/* RIGHT SECTION: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Expandable Search Bar */}
            <div ref={searchContainerRef} className="flex items-center justify-end">
              <div className={`flex items-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full max-w-[200px] sm:max-w-[300px]' : 'w-8'}`}>
                {isSearchOpen ? (
                   <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center" role="search">
                     <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search..." 
                        aria-label="Search products"
                        className="w-full h-10 bg-gray-100/50 border border-gray-200/50 rounded-full px-4 pr-10 text-sm focus:ring-2 focus:ring-black/5 outline-none text-gray-900 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                     <button 
                        type="button" 
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Close search"
                     >
                       <X size={14} aria-hidden="true" />
                     </button>
                   </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Open search"
                  >
                    <Search size={20} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Cart */}
            <button 
              className="text-gray-800 hover:text-black transition-colors relative w-8 h-8 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              onClick={onOpenCart}
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop User Menu */}
            <div className="relative hidden md:flex items-center" ref={dropdownRef}>
              {user ? (
                 <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center gap-2 focus:outline-none ml-2 rounded-full focus:ring-2 focus:ring-black"
                   aria-expanded={isUserMenuOpen}
                   aria-haspopup="true"
                   aria-label="User menu"
                 >
                   <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden ring-2 ring-transparent hover:ring-brand-100 transition-all">
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                   </div>
                 </button>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <button 
                    onClick={() => onNavigate('/login')}
                    className="text-sm font-bold text-gray-900 hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded px-2 py-1"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => onNavigate('/register')}
                    className="text-sm font-bold text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 origin-top-right animate-in fade-in slide-in-from-top-2 z-50" role="menu">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  </div>
                  
                  {user.role === 'admin' ? (
                     <button 
                       onClick={() => { onNavigate('/admin'); setIsUserMenuOpen(false); }}
                       className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2 transition-colors focus:outline-none focus:bg-gray-50"
                       role="menuitem"
                     >
                       <Settings size={16} aria-hidden="true" /> Admin Dashboard
                     </button>
                  ) : (
                    <>
                      <button 
                         onClick={() => { onNavigate('/profile?tab=profile'); setIsUserMenuOpen(false); }}
                         className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2 transition-colors focus:outline-none focus:bg-gray-50"
                         role="menuitem"
                       >
                         <UserIcon size={16} aria-hidden="true" /> My Profile
                       </button>
                       <button 
                         onClick={() => { onNavigate('/profile?tab=orders'); setIsUserMenuOpen(false); }}
                         className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2 transition-colors focus:outline-none focus:bg-gray-50"
                         role="menuitem"
                       >
                         <Package size={16} aria-hidden="true" /> Order History
                       </button>
                       <button 
                         onClick={() => { onNavigate('/profile?tab=wishlist'); setIsUserMenuOpen(false); }}
                         className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2 transition-colors focus:outline-none focus:bg-gray-50"
                         role="menuitem"
                       >
                         <Heart size={16} aria-hidden="true" /> Wishlist
                       </button>
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 my-1"></div>

                  <button 
                    onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors focus:outline-none focus:bg-red-50"
                    role="menuitem"
                  >
                    <LogOut size={16} aria-hidden="true" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-800 ml-2 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2">
          <div className="p-4 space-y-4">
            
            {/* Search in Mobile Menu */}
            {!isSearchOpen && (
              <form onSubmit={handleSearchSubmit} className="relative" role="search">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} aria-hidden="true" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  aria-label="Search products"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}

            <div className="space-y-1">
              <button onClick={() => handleMobileNav('/#shop')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg focus:outline-none focus:bg-gray-50">Shop</button>
              <button onClick={() => handleMobileNav('/#collections')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg focus:outline-none focus:bg-gray-50">Collections</button>
              <button onClick={() => handleMobileNav('/#footer')} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg focus:outline-none focus:bg-gray-50">About</button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 mb-4">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                     <button onClick={() => handleMobileNav('/profile?tab=profile')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between focus:outline-none focus:bg-gray-50">
                       <span className="flex items-center gap-2"><UserIcon size={18} aria-hidden="true" /> My Profile</span>
                       <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
                     </button>
                     <button onClick={() => handleMobileNav('/profile?tab=orders')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between focus:outline-none focus:bg-gray-50">
                       <span className="flex items-center gap-2"><Package size={18} aria-hidden="true" /> Orders</span>
                       <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
                     </button>
                     <button onClick={() => handleMobileNav('/profile?tab=wishlist')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between focus:outline-none focus:bg-gray-50">
                       <span className="flex items-center gap-2"><Heart size={18} aria-hidden="true" /> Wishlist</span>
                       <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
                     </button>
                     <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 focus:outline-none focus:bg-red-50">
                       <LogOut size={18} aria-hidden="true" /> Sign Out
                     </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 px-4">
                  <button onClick={() => handleMobileNav('/login')} className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">Sign In</button>
                  <button onClick={() => handleMobileNav('/register')} className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
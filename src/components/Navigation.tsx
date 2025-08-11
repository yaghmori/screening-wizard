'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Plus, List, Home, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/intake', label: 'Create New Intake', icon: Plus },
    { href: '/records', label: 'View Records', icon: List },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-22 h-12  backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Allyfe Logo"
                  width={68}
                  height={68}
                  className="object-cover"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">Screening Wizard</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-blue-600 hover:bg-white/90 shadow-md' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5 backdrop-blur-sm rounded-lg mt-2 border border-white/10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                    <Button 
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start flex items-center space-x-3 transition-all duration-200 ${
                        isActive 
                          ? 'bg-white text-blue-600 hover:bg-white/90' 
                          : 'text-white hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

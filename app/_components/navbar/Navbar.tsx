'use client'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../../../assets/images/freshcart-logo.svg';
import { CiFacebook, CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci";
import { FaTiktok, FaYoutube } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { cartResponse } from '@/app/types/cart-interface';
import UserMenu from '../userMenu/UserMenu';
import ThemeToggle from '../theme/Theme';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isToggle, setIsToggle] = useState(false);

  const { data: cartDta } = useQuery<cartResponse>({
    queryKey: ['get-cart'], 
    queryFn: async () => {
      const resp = await fetch('/api/cart');
      if (!resp.ok) throw new Error('Failed to fetch');
      return await resp.json();
    },
    refetchInterval: 3000,
    enabled: status === 'authenticated', 
    refetchOnWindowFocus: true 
  });

  // Fetch wishlist count
  const { data: wishlistData } = useQuery<{ status: string; data: string[] }>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const resp = await fetch('/api/wishlist');
      if (!resp.ok) throw new Error('Failed to fetch');
      return await resp.json();
    },
    enabled: status === 'authenticated',
    refetchOnWindowFocus: true
  });

  const cartCount = cartDta?.numOfCartItems || 0;
  const wishlistCount = wishlistData?.data?.length || 0;

  function handleToggle() {
    setIsToggle(!isToggle);
  }

  const icons = [
    { icon: <CiInstagram />, link: '#', name: 'Instagram' },
    { icon: <CiFacebook />, link: '#', name: 'Facebook' },
    { icon: <FaTiktok />, link: '#', name: 'TikTok' },
    { icon: <CiTwitter />, link: '#', name: 'Twitter' },
    { icon: <CiLinkedin />, link: '#', name: 'LinkedIn' },
    { icon: <FaYoutube />, link: '#', name: 'YouTube' },
  ];

  const Path = [
    { path: '/', Content: 'Home' },
    { path: '/category', Content: 'Category' },
    { path: '/brand', Content: 'Brand' },
  ];

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl flex flex-wrap lg:flex-nowrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image width={160} height={40} src={logo} alt="FreshCart Logo" priority />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          onClick={handleToggle}
          type="button"
          className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg ml-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Content */}
        <div className="hidden lg:flex items-center justify-between w-full ml-8">
          {/* Main Links */}
          <ul className="flex flex-row gap-6">
            {Path.map((ele) => (
              <li key={ele.Content}>
                <Link
                  href={ele.path}
                  className={`transition-colors ${pathname === ele.path ? 'text-green-600 font-bold' : 'text-gray-700 dark:text-gray-200 hover:text-green-500'}`}
                >
                  {ele.Content}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Social + Cart + UserMenu */}
          <div className="flex items-center gap-5">
            <div className="flex gap-3 border-r border-gray-300 pr-4">
              {icons.map((ele) => (
                <Link key={ele.name} href={ele.link} className="text-xl text-gray-600 dark:text-gray-300 hover:text-green-600">
                  {ele.icon}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Wishlist Icon with Badge - only show when authenticated */}
              {status === 'authenticated' && (
                <Link href="/wishlist" className="relative p-2 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 dark:text-gray-200 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Cart Icon with Badge - only show when authenticated */}
              {status === 'authenticated' && (
                <Link href="/cart" className="relative p-2 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 dark:text-gray-200 group-hover:text-green-600 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              
              {/* User Menu Component */}
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isToggle && (
          <div className="w-full lg:hidden bg-white dark:bg-gray-800 rounded-xl shadow-inner mt-4 p-4 border border-gray-100 dark:border-gray-700">
            <ul className="flex flex-col gap-4">
              {Path.map((ele) => (
                <li key={ele.Content}>
                  <Link href={ele.path} onClick={() => setIsToggle(false)} className={`block p-2 rounded ${pathname === ele.path ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 font-bold' : 'text-gray-700 dark:text-gray-200'}`}>
                    {ele.Content}
                  </Link>
                </li>
              ))}
              <hr />
              
              {/* Theme Toggle for mobile */}
              <div className="flex items-center justify-between p-2">
                <span className="font-medium text-gray-700 dark:text-gray-200">Theme</span>
                <ThemeToggle />
              </div>
              
              {/* Wishlist link for mobile - only when authenticated */}
              {status === 'authenticated' && (
                <Link href="/wishlist" onClick={() => setIsToggle(false)} className="flex items-center justify-between p-2 bg-rose-50 dark:bg-rose-900/20 rounded">
                  <span className="font-medium text-gray-700 dark:text-gray-200">My Wishlist</span>
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">{wishlistCount}</span>
                </Link>
              )}
              
              {/* Cart link for mobile - only when authenticated */}
              {status === 'authenticated' && (
                <Link href="/cart" onClick={() => setIsToggle(false)} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium text-gray-700 dark:text-gray-200">My Cart</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">{cartCount}</span>
                </Link>
              )}
              
              <div className="pt-2">
                <UserMenu />
              </div>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
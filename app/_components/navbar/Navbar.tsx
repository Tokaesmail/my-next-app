'use client'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../../../assets/images/freshcart-logo.svg';
import { CiFacebook, CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci";
import { FaTiktok, FaYoutube } from 'react-icons/fa6';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isToggle, setIsToggle] = useState(false);
  const pathname = usePathname();

  function handleToggle() {
    setIsToggle(!isToggle);
  }

  function logout() {
    signOut({
      callbackUrl: '/login'
    });
  }

  const icons = [
    { icon: <CiInstagram />, link: 'https://www.instagram.com/freshcart', name: 'Instagram' },
    { icon: <CiFacebook />, link: 'https://www.facebook.com/freshcart', name: 'Facebook' },
    { icon: <FaTiktok />, link: 'https://www.tiktok.com/freshcart', name: 'TikTok' },
    { icon: <CiTwitter />, link: 'https://www.twitter.com/freshcart', name: 'Twitter' },
    { icon: <CiLinkedin />, link: 'https://www.linkedin.com/freshcart', name: 'LinkedIn' },
    { icon: <FaYoutube />, link: 'https://www.youtube.com/freshcart', name: 'YouTube' },
  ];

  const Path = [
    { path: '/', Content: 'Home' },
    { path: '/cart', Content: 'Cart' },
    { path: '/product', Content: 'Product' },
    { path: '/category', Content: 'Category' },
    { path: '/brand', Content: 'Brand' },
  ];

  const authPath = [
    { path: '/login', Content: 'Login' },
    { path: '/register', Content: 'Register' }
  ];

  return (
    <nav className="bg-gray-200 sticky top-0 z-50 shadow-md ">
      <div className="max-w-7xl flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
            <Image
              width={200}
              height={200}
              src={logo}
              alt="FreshCart Logo"
              priority
            />
          </span>
        </Link>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base lg:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary ml-auto"
          aria-controls="navbar-default"
          aria-expanded={isToggle}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Main Navigation Links */}
          <ul className="flex flex-row justify-center items-center gap-6 w-full">
            {Path.map((ele) => (
              <li key={ele.Content}>
                <Link
                  href={ele.path}
                  className={`block text-heading rounded hover:bg-transparent border-0 hover:text-fg-brand p-0 transition-colors ${
                    pathname === ele.path ? 'text-fg-brand font-semibold' : ''
                  }`}
                >
                  {ele.Content}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side: Social Icons + Auth/User */}
          <ul className="flex flex-row justify-end items-center gap-6 w-full">
            {/* Social Icons - تظهر في Desktop فقط */}
            <li className="flex gap-3">
              {icons.map((ele) => (
                <Link
                  key={ele.name}
                  href={ele.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:text-fg-brand transition-colors hover:scale-110"
                  aria-label={ele.name}
                >
                  {ele.icon}
                </Link>
              ))}
            </li>

            {/* Cart & User Info */}
            {status === 'loading' ? (
              <li>
                <div className="animate-pulse bg-gray-400 h-4 w-20 rounded"></div>
              </li>
            ) : status === 'authenticated' ? (
              <>
                <li>
                  <Link href="/cart" className="flex items-center gap-2 hover:text-fg-brand transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {session?.user?.cart && (
                      <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                        {session.user.cart}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="text-heading font-medium text-sm">
                  Hi, {session?.user?.name || 'User'}
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="cursor-pointer text-heading hover:text-fg-brand transition-colors font-medium text-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {authPath.map((ele) => (
                  <li key={ele.Content}>
                    <Link
                      href={ele.path}
                      className={`block text-heading rounded hover:bg-transparent border-0 hover:text-fg-brand p-0 transition-colors text-sm ${
                        pathname === ele.path ? 'text-fg-brand font-semibold' : ''
                      }`}
                    >
                      {ele.Content}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        {/* Mobile/Tablet Menu */}
        {isToggle && (
          <div className="w-full lg:hidden bg-gray-200 dark:bg-gray-700 rounded-lg mt-4 p-4">
            {/* Navigation Links */}
            <ul className="flex flex-col gap-3 mb-4 pb-4 border-b border-gray-400">
              {Path.map((ele) => (
                <li key={ele.Content}>
                  <Link
                    href={ele.path}
                    className={`block text-heading rounded p-2 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 ${
                      pathname === ele.path ? 'text-fg-brand font-semibold bg-gray-300 dark:bg-gray-600' : ''
                    }`}
                    onClick={() => setIsToggle(false)}
                  >
                    {ele.Content}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cart Icon + Logout (للمستخدمين المسجلين) */}
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-400 h-8 w-32 rounded"></div>
            ) : status === 'authenticated' ? (
              <div className="flex flex-col gap-3">
                {/* Cart */}
                <Link 
                  href="/cart" 
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsToggle(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="text-heading">Cart</span>
                  {session?.user?.cart && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs ml-auto">
                      {session.user.cart}
                    </span>
                  )}
                </Link>

                {/* User Name */}
                <div className="text-heading font-medium px-2">
                  Hi, {session?.user?.name || 'User'}
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setIsToggle(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-left text-heading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {authPath.map((ele) => (
                  <Link
                    key={ele.Content}
                    href={ele.path}
                    className={`block text-heading rounded p-2 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 ${
                      pathname === ele.path ? 'text-fg-brand font-semibold bg-gray-300 dark:bg-gray-600' : ''
                    }`}
                    onClick={() => setIsToggle(false)}
                  >
                    {ele.Content}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isToggle, setIsToggle] = useState(false);

  function handleToggle() {
    setIsToggle(!isToggle);
  }

  const Path=[
    {path:'/',Content:'Home'},
    {path:'/product',Content:'Product'},
    {path:'/about',Content:'About'},
    {path:'/contact',Content:'Contact'},
  ]
  const authPath=[
    {path:'/login',Content:'Login'},
    {path:'/register',Content:'Register'}
  ]
  const path = usePathname();
  return (
      <>
          
<nav className="bg-gray-300 dark:bg-gray-800">
  <div className="max-w-7xl flex flex-wrap md:flex-nowrap gap-14 items-center justify-between mx-auto p-4">
    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">frish cart</span>
    </a>
    <button data-collapse-toggle="navbar-default" onClick={handleToggle} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" /></svg>
    </button>
    <div className={`${!isToggle&& 'hidden'}  w-full md:flex items-center justify-between`} id="navbar-default">

  <ul className="flex flex-row justify-center items-center gap-6 w-full">
    {Path.map((ele) => (
      <li key={ele.Content}>
        <Link
          href={ele.path}
          className="block text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
        >
          {ele.Content}
        </Link>
      </li>
    ))}
  </ul>

  <ul className="flex flex-row justify-end items-center gap-6 w-full">
    {authPath.map((ele) => (
      <li key={ele.Content}>
        <Link
          href={ele.path}
          className="block text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
        >
          {ele.Content}
        </Link>
      </li>
    ))}
  </ul>

</div>

  </div>
</nav>


        </>
  )
}

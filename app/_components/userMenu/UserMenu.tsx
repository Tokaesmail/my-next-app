'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserMenu() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/login' 
      })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (status === 'loading') {
    return <div className="text-gray-600">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex gap-3">
        <Link
          href="/login"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm font-medium"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span>{(session as any)?.user?.name?.split(' ')[0] || 'Account'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <Link
            href="/change-password"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Change Password
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            My Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
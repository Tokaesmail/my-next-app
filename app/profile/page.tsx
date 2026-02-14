'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      // هنا ممكن تعملي API call لجلب بيانات المستخدم الكاملة
      // دلوقتي هستخدم البيانات من الـ session
      setUserData(session?.user)
      setIsLoading(false)
    }
  }, [status, session, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <Image
          src={background}
          alt="background"
          fill
          className="object-cover absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12">
      <Image
        src={background}
        alt="background"
        fill
        className="object-cover absolute inset-0 z-0"
        priority
      />

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 w-full max-w-2xl bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg mx-4">
        <h1 className="text-3xl text-center mb-8 text-green-500 font-semibold">
          My Profile
        </h1>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
              {userData?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="border-b border-white/20 pb-4">
              <label className="text-green-400 text-sm font-semibold block mb-2">
                Full Name
              </label>
              <p className="text-white text-lg">{userData?.name || 'N/A'}</p>
            </div>

            <div className="border-b border-white/20 pb-4">
              <label className="text-green-400 text-sm font-semibold block mb-2">
                Email Address
              </label>
              <p className="text-white text-lg">{userData?.email || 'N/A'}</p>
            </div>

            <div className="pb-4">
              <label className="text-green-400 text-sm font-semibold block mb-2">
                Account Status
              </label>
              <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => router.push('/change-password')}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition font-medium"
            >
              Change Password
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="bg-white/20 text-white px-6 py-3 rounded-md hover:bg-white/30 transition font-medium backdrop-blur-sm border border-white/30"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
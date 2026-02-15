import React from 'react'
import img1 from '../assets/images/error.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4'>
      <div className='relative w-full max-w-md md:max-w-lg lg:max-w-xl mb-8'>
        <Image
          src={img1}
          alt="404 Error - Page Not Found"
          width={600}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>
      
      <div className='text-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          Oops! Page Not Found
        </h1>
        <p className='text-gray-600 text-lg mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className='inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md'
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Categorycart({ pro}:{pro:any}) {
  console.log(pro);

  const { _id, name, slug , age, image } = pro;

  return (
    <>
      <Link
        href={`/category/${_id}`}
        className="group mt-10 block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            width={400}
            height={400}
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized 
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
            <h3 className="font-poppins text-2xl font-bold mb-1 drop-shadow-lg">
              {name}
            </h3>
            <p className="text-sm font-medium opacity-95 drop-shadow">
              {age} Items
            </p>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex items-center gap-2 p-4 bg-white flex-wrap">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md group-hover:-translate-y-0.5 transition-transform">
            Organic
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md group-hover:-translate-y-0.5 transition-transform">
            Fresh
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md group-hover:-translate-y-0.5 transition-transform">
            Local
          </span>

          {/* Arrow Icon */}
          <div className="ml-auto w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white group-hover:bg-green-700 group-hover:translate-x-1 transition-all duration-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </>
  );
}
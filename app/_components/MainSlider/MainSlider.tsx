'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '../../../assets/images/blog-img-1.jpeg'
import img2 from '../../../assets/images/blog-img-2.jpeg'
import img3 from '../../../assets/images/slider-image-1.jpeg'
import img4 from '../../../assets/images/slider-image-2.jpeg'
import img5 from '../../../assets/images/slider-image-3.jpeg'
import Image from 'next/image';

export default function MainSlider() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 py-4 md:py-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          {/* Main Slider Section */}
          <div className="w-full lg:w-3/4">
            <div className="relative rounded-xl overflow-hidden shadow-lg border dark:border-gray-800 group">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 1000, disableOnInteraction: false }}
                pagination={{ 
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-emerald-500 !opacity-100',
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="main-slider 
                  [&_.swiper-button-next]:after:text-sm [&_.swiper-button-next]:after:font-bold [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-black/40 [&_.swiper-button-next]:backdrop-blur-md [&_.swiper-button-next]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:hidden sm:[&_.swiper-button-next]:flex 
                  [&_.swiper-button-prev]:after:text-sm [&_.swiper-button-prev]:after:font-bold [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-black/40 [&_.swiper-button-prev]:backdrop-blur-md [&_.swiper-button-prev]:w-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:hidden sm:[&_.swiper-button-prev]:flex 
                  [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-60"
              >
                {[img3, img4, img5].map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-112.5">
                      <Image 
                        src={img} 
                        alt={`Slider Image ${index + 1}`} 
                        fill 
                        className="object-cover" 
                        priority={index === 0} 
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Side Images Section */}
          <div className="w-full lg:w-1/4">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              {[img1, img2].map((img, index) => (
                <div 
                  key={index} 
                  className="relative rounded-xl overflow-hidden shadow-lg border dark:border-gray-800 h-37.5 sm:h-50 lg:h-53.25"
                >
                  <Image 
                    src={img} 
                    alt={`Blog Image ${index + 1}`} 
                    fill 
                    className="object-cover hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
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
    <div className="w-full bg-gray-50 py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="w-full lg:w-3/4">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="main-slider"
              >
                <SwiperSlide>
                  <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-112.5">
                    <Image
                      src={img3}
                      alt="Slider Image 1"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-112.5">
                    <Image
                      src={img4}
                      alt="Slider Image 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-112.5">
                    <Image
                      src={img5}
                      alt="Slider Image 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              {/* Image 1 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg h-37.5 sm:h-50 lg:h-61.25">
                <Image
                  src={img1}
                  alt="Blog Image 1"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Image 2 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg h-37.5 sm:h-50 lg:h-61.25">
                <Image
                  src={img2}
                  alt="Blog Image 2"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .main-slider .swiper-button-next,
        .main-slider .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }

        .main-slider .swiper-button-next:after,
        .main-slider .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }

        .main-slider .swiper-button-next:hover,
        .main-slider .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .main-slider .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
        }

        .main-slider .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }

        /* Hide navigation arrows on mobile */
        @media (max-width: 640px) {
          .main-slider .swiper-button-next,
          .main-slider .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
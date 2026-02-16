'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function CategoriesSlider() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        const { data } = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our popular categories
          </p>
        </div>

        {/* Categories Slider */}
        <Swiper
          spaceBetween={16}
          slidesPerView={2}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 28,
            },
          }}
          modules={[Autoplay]}
          className="categories-slider"
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link href={`/categories/${category.slug}`}>
                <div className="group relative">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                    
                    {/* Category Name */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-semibold text-white text-center line-clamp-2 transition-transform duration-300 group-hover:scale-105">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Hover Ring Effect */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/50" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .categories-slider .swiper-wrapper {
          transition-timing-function: linear !important;
        }

        .categories-slider .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
}
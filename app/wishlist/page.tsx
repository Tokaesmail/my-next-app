'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiOutlineShoppingCart, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AddToCartButton from "@/app/button/button";

interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
}

interface WishlistResponse {
  status: string;
  count: number;
  data: WishlistProduct[];
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Fetch wishlist
  const { data: wishlistData, isLoading } = useQuery<WishlistResponse>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await fetch('/api/wishlist');
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return response.json();
    },
    enabled: status === 'authenticated',
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist!', {
        icon: '💔',
        style: {
          borderRadius: '12px',
          background: '#1f2937',
          color: '#fff',
        },
      });
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  // Add to cart mutation
  const addToCart = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
      toast.success('Added to cart!', {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: () => {
      toast.error('Failed to add to cart');
    },
  });

  const handleRemove = (productId: string) => {
    removeFromWishlist.mutate(productId);
  };

  const handleAddToCart = (productId: string) => {
    addToCart.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-100">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full"
              />
              <HiHeart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-600 w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wishlistItems = wishlistData?.data || [];
  const isEmpty = wishlistItems.length === 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                My Wishlist
                <HiHeart className="inline-block ml-3 text-rose-500 animate-pulse" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-gray-100 dark:border-gray-700">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <HiHeart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start adding products you love!
              </p>
              <Link href="/">
                <button className="bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Start Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Wishlist Grid */}
        {!isEmpty && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                    {/* Product Image */}
                    <Link href={`/product/${product._id}`} className="relative block">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={product.imageCover}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-gray-200 dark:border-gray-600"
                      disabled={removeFromWishlist.isPending}
                    >
                      <HiHeart className="w-5 h-5 text-rose-500 fill-current" />
                    </motion.button>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/product/${product._id}`}>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors min-h-12">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                          <span className="text-amber-500 text-sm">★</span>
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 ml-1">
                            {product.ratingsAverage}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category.name}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-black text-green-600 dark:text-green-400">
                            ${product.price}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <AddToCartButton product={product._id}/>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

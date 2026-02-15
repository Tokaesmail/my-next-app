'use client'
import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface WishlistResponse {
  status: string;
  data: string[]; // array of product IDs
}

export default function WishlistButton({ productId, size = 'md', className = '' }: WishlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch wishlist to check if product is in it
  const { data: wishlistData } = useQuery<WishlistResponse>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await fetch('/api/wishlist');
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return response.json();
    },
    enabled: status === 'authenticated',
  });

const isInWishlist = wishlistData?.data?.some((item: any) => item._id === productId) || false;

  // Toggle wishlist mutation
  const toggleWishlist = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error('Not authenticated');
      }

      const method = isInWishlist ? 'DELETE' : 'POST';
      const response = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Failed to update wishlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);

      if (isInWishlist) {
        toast.success('Removed from wishlist', {
          icon: '💔',
          style: {
            borderRadius: '12px',
            background: '#1f2937',
            color: '#fff',
          },
        });
      } else {
        toast.success('Added to wishlist!', {
          icon: '❤️',
          style: {
            borderRadius: '12px',
            background: '#ec4899',
            color: '#fff',
          },
        });
      }
    },
    onError: (error: Error) => {
      if (error.message === 'Not authenticated') {
        toast.error('Please login to add to wishlist', {
          icon: '🔒',
        });
        router.push('/login');
      } else {
        toast.error('Something went wrong');
      }
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'unauthenticated') {
      toast.error('Please login to add to wishlist', {
        icon: '🔒',
      });
      router.push('/login');
      return;
    }

    toggleWishlist.mutate();
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={toggleWishlist.isPending}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative bg-white dark:bg-gray-800 ${buttonSizes[size]} rounded-full 
        shadow-md hover:shadow-lg transition-all duration-200
        border border-gray-200 dark:border-gray-600
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.div
        animate={isAnimating ? {
          scale: [1, 1.5, 1],
          rotate: [0, 10, -10, 0],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {isInWishlist ? (
          <HiHeart className={`${sizeClasses[size]} text-rose-500 fill-current`} />
        ) : (
          <HiOutlineHeart className={`${sizeClasses[size]} text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors`} />
        )}
      </motion.div>

      {/* Particles effect on add */}
      {isAnimating && !isInWishlist && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 20,
                y: Math.sin((i * Math.PI) / 3) * 20,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-rose-500 rounded-full"
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
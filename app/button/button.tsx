'use client'
import { CardFooter } from '@/components/ui/card';
import { cartServices } from '../services/cart/cart-servecis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function Button({ product }: { product: string }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userToken = (session as any)?.token;

  const { mutate: addProductToCart, isPending } = useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => 
      cartServices(id, token),
    onSuccess(data) {
      if (data?.status === 'success') {
        toast.success(data?.message || 'Added to cart successfully');
        queryClient.invalidateQueries({ queryKey: ['getCart'] });
      } else {
        toast.error(data?.message || 'Failed to add to cart');
      }
    },
    onError(error: any) {
      console.error('Mutation Error:', error);
      toast.error(error?.message || 'Please login first');
    }
  });

  const handleAddToCart = () => {
    if (!userToken) {
      toast.error("Please login first");
      return;
    }
    addProductToCart({ id: product, token: userToken });
  };

  return (
    <CardFooter className="flex justify-between items-center">
      <button 
        disabled={isPending}
        onClick={handleAddToCart} 
        className="w-auto bg-green-600 mt-2 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Adding...' : 'Add to cart'}
      </button>
      
      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Add to wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
    </CardFooter>
  );
}
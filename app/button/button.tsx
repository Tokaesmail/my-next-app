'use client'
import { CardFooter } from '@/components/ui/card';
import { cartServices } from '../services/cart/cart-servecis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function Button({ product }: { product: string }) {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();  const userToken = (session as any)?.token;
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
    <CardFooter className="flex justify-between items-center gap-2">
      <button 
      disabled={isPending || status === 'loading'}
      onClick={handleAddToCart} 
      className="flex-1 bg-green-500 w-full hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Adding...</span>
        </>
      ) : (
        <>
          <span>Add to Cart</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </>
      )}
    </button>
    </CardFooter>
  );
}
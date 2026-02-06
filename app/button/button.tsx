'use client'
import { CardFooter } from '@/components/ui/card';
import { cartServices } from '../services/cart/cart-servecis';
import { useMutation } from '@tanstack/react-query';
import { ProductCard } from '../_components/productCard/ProductCard';
import toast from 'react-hot-toast';

export default function Button({product}:{product:string}) {
  const {error,isError,isPending,mutate:addProductToCart,data} =useMutation({
    mutationFn:cartServices,
    
    onSuccess(data) {
      toast.success(data.message)
    },
    onError(data){
      toast.error('login first')
    }
  })
  console.log(data)
  return (
    <>
      <CardFooter className="flex justify-between">
        <button onClick={()=>{
            addProductToCart(product)
        }} className="w-auto bg-green-600 mt-2 text-white p-2 rounded hover:bg-green-700 ">Add card</button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </CardFooter>
    </>
  )
}

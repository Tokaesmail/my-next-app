'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { MdDelete } from 'react-icons/md'
import { cartResponse } from '../types/cart-interface'
import { deleteCartItem } from '../services/cart/delete-cart-item'
import { useSession } from 'next-auth/react'

export default function Cart() {
  const queryClient = useQueryClient();
  
  const { data: session } = useSession();
  const userToken = (session as any)?.token;

  const { data: cartDta, isLoading, isError } = useQuery<cartResponse>({
    queryKey: ['get-cart'],
    queryFn: async () => {
      const resp = await fetch('/api/cart')
      if (!resp.ok) throw new Error('Failed to fetch')
      return await resp.json()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await deleteCartItem(productId, userToken);
    },
    onSuccess: (result) => {
      if (result.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['get-cart'] });
      }
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (isError || !cartDta || cartDta.data.products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Cart Empty</h2>
        <Link href="/" className="text-green-600 hover:underline">Lets Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">Shopping Cart</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cartDta.numOfCartItems} items in your cart</p>
          </div>

          <div className="space-y-4">
            {cartDta.data.products.map((pro) => (
              <div key={pro._id} className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all ${deleteMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={pro.product.imageCover} alt={pro.product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{pro.product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{pro.product.category?.name || 'Category'}</p>
                </div>

                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-2 py-1">
                  <button className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl">−</button>
                  <span className="w-8 text-center font-medium">{pro.count}</span>
                  <button className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl">+</button>
                </div>

                <div className="text-right min-w-25">
                  <div className="font-bold text-gray-900 text-lg">{pro.price} EGY</div>
                </div>

                <button 
                  onClick={() => deleteMutation.mutate(pro.product._id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 p-2 text-2xl"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartDta.numOfCartItems} items)</span>
                <span className="font-medium">{cartDta.data.totalCartPrice} EGY</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{cartDta.data.totalCartPrice} EGY</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
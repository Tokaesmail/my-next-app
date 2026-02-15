'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { MdDelete } from 'react-icons/md'
import { cartResponse } from '../types/cart-interface'
import { deleteCartItem } from '../services/cart/delete-cart-item'
import { useSession } from 'next-auth/react'
import { UpdateCart } from '../services/cart/Update-cart'
import { applyCoupon } from '../services/cart/apply-coupon'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart() {
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  
  const { data: session } = useSession();
  const userToken = (session as any)?.token;

  const { data: cartDta, isLoading, isError } = useQuery<cartResponse>({
    queryKey: ['get-cart'],
    queryFn: async () => {
    const resp = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
      headers: {
        token: userToken,
      },
    });
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

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      return await UpdateCart(productId, userToken, count);
    },
    onSuccess: (result) => {
      if (result.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['get-cart'] });
      }
    },
    onError: (error) => {
      console.error("Update failed:", error);
    }
  });

  const couponMutation = useMutation({
    mutationFn: async (couponName: string) => {
      return await applyCoupon(couponName, userToken);
    },
    onSuccess: (result) => {
      if (result.status === 'success') {
        toast.success('Coupon applied successfully!');
        queryClient.invalidateQueries({ queryKey: ['get-cart'] });
        setCouponCode('');
      } else {
        toast.error(result.message || 'Failed to apply coupon');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to apply coupon');
    }
  });

  function handleUpdate(productId: string, count: number) {
    if (count < 1) return;
    updateCartMutation.mutate({ productId, count });
  }

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    couponMutation.mutate(couponCode);
  }

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

  // ✅ حساب الخصم والسعر النهائي
  const hasDiscount = cartDta.data.totalPriceAfterDiscount && 
                      cartDta.data.totalPriceAfterDiscount !== cartDta.data.totalCartPrice;
  const finalPrice = cartDta.data.totalPriceAfterDiscount || cartDta.data.totalCartPrice;
  const discountAmount = hasDiscount 
    ? cartDta.data.totalCartPrice - (cartDta.data.totalPriceAfterDiscount || 0)
    : 0;

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
              <div 
                key={pro._id} 
                className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all ${
                  deleteMutation.isPending || updateCartMutation.isPending 
                    ? 'opacity-50 pointer-events-none' 
                    : ''
                }`}
              >
                <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={pro.product.imageCover} 
                    alt={pro.product.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{pro.product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {pro.product.category?.name || 'Category'}
                  </p>
                </div>

                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-2 py-1">
                  <button 
                    onClick={() => handleUpdate(pro.product._id, pro.count - 1)}
                    disabled={pro.count <= 1 || updateCartMutation.isPending}
                    className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  
                  <span className="w-8 text-center font-medium">{pro.count}</span>
                  
                  <button 
                    onClick={() => handleUpdate(pro.product._id, pro.count + 1)}
                    disabled={updateCartMutation.isPending}
                    className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-25">
                  <div className="font-bold text-gray-900 text-lg">{pro.price} EGY</div>
                </div>

                <button 
                  onClick={() => deleteMutation.mutate(pro.product._id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 p-2 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            
            {/* Coupon Section */}
            <div className="border-t border-b border-gray-200 py-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Have a Coupon?</h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  disabled={couponMutation.isPending}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm uppercase"
                />
                <button
                  type="submit"
                  disabled={couponMutation.isPending || !couponCode.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {couponMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying...
                    </span>
                  ) : (
                    'Apply'
                  )}
                </button>
              </form>
              
              {/* ✅ Success Indicator */}
              {hasDiscount && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-medium">Coupon applied!</span>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartDta.numOfCartItems} items)</span>
                <span className="font-medium">{cartDta.data.totalCartPrice} EGY</span>
              </div>
              
              {/* ✅ Discount Display */}
              {hasDiscount && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-medium">
                    -{discountAmount.toFixed(2)} EGY
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{finalPrice} EGY</span>
                </div>
                
                {/* ✅ Old Price with strikethrough */}
                {hasDiscount && (
                  <div className="text-right mt-1">
                    <span className="text-sm text-gray-400 line-through">
                      {cartDta.data.totalCartPrice} EGY
                    </span>
                  </div>
                )}
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
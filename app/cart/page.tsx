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
import { useRouter } from 'next/navigation'

export default function Cart() {
  const router = useRouter();
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
        toast.success('Item removed from cart');
      }
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error('Failed to remove item');
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
      toast.error('Failed to update quantity');
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

  const handleCheckout = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('cartId', cartDta?.data._id || '');
    sessionStorage.setItem('cartTotal', finalPrice.toString());
  }
  router.push('/checkout/step1-address');
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 dark:border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
        </div>
      </div>
    )
  }

  const isCartEmpty = !cartDta || !cartDta.data || !cartDta.data.products || cartDta.data.products.length === 0;

  if (isError || isCartEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-semibold"
          >
            Let's Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = cartDta.data.totalPriceAfterDiscount && 
                      cartDta.data.totalPriceAfterDiscount !== cartDta.data.totalCartPrice;
  const finalPrice = cartDta.data.totalPriceAfterDiscount || cartDta.data.totalCartPrice;
  const discountAmount = hasDiscount 
    ? cartDta.data.totalCartPrice - (cartDta.data.totalPriceAfterDiscount || 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-500 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Shopping Cart</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shopping Cart</h1>
              <p className="text-gray-600 dark:text-gray-400">{cartDta.numOfCartItems} items in your cart</p>
            </div>

            <div className="space-y-4">
              {cartDta.data.products.map((pro) => (
                <div 
                  key={pro._id} 
                  className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:shadow-xl transition-all ${
                    deleteMutation.isPending || updateCartMutation.isPending 
                      ? 'opacity-50 pointer-events-none' 
                      : ''
                  }`}
                >
                  <div className="relative w-24 h-24 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src={pro.product.imageCover} 
                      alt={pro.product.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{pro.product.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {pro.product.category?.name || 'Category'}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800">
                    <button 
                      onClick={() => handleUpdate(pro.product._id, pro.count - 1)}
                      disabled={pro.count <= 1 || updateCartMutation.isPending}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 w-6 h-6 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">{pro.count}</span>
                    
                    <button 
                      onClick={() => handleUpdate(pro.product._id, pro.count + 1)}
                      disabled={updateCartMutation.isPending}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 w-6 h-6 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-25">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{pro.price} EGP</div>
                  </div>

                  <button 
                    onClick={() => deleteMutation.mutate(pro.product._id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="border-t border-b border-gray-200 dark:border-gray-800 py-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Have a Coupon?</h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    disabled={couponMutation.isPending}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm uppercase placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={couponMutation.isPending || !couponCode.trim()}
                    className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-semibold text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
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
                
                {hasDiscount && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 dark:text-green-500 font-medium">Coupon applied!</span>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cartDta.numOfCartItems} items)</span>
                  <span className="font-medium">{cartDta.data.totalCartPrice} EGP</span>
                </div>
                
                {hasDiscount && (
                  <div className="flex justify-between text-green-600 dark:text-green-500">
                    <span className="font-medium">Discount</span>
                    <span className="font-medium">
                      -{discountAmount.toFixed(2)} EGP
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-500">Free</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>{finalPrice} EGP</span>
                  </div>
                  
                  {hasDiscount && (
                    <div className="text-right mt-1">
                      <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                        {cartDta.data.totalCartPrice} EGP
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-semibold shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
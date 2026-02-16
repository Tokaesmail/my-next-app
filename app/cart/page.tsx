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
    },
    enabled: !!userToken // لا يتم الجلب إلا إذا وجد التوكن
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
    onError: () => toast.error('Failed to remove item')
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
    onError: () => toast.error('Failed to update quantity')
  });

  const couponMutation = useMutation({
    mutationFn: async (couponName: string) => {
      return await applyCoupon(couponName, userToken);
    },
    onSuccess: (result) => {
      if (result.status === 'success') {
        toast.success('Coupon applied successfully! ✅');
        queryClient.invalidateQueries({ queryKey: ['get-cart'] });
        setCouponCode('');
      } else {
        toast.error(result.message || 'Invalid coupon code');
      }
    },
    onError: (error: any) => toast.error(error?.message || 'Failed to apply coupon')
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

  const isCartEmpty = !cartDta || !cartDta.data || !cartDta.data.products || cartDta.data.products.length === 0;
  const finalPrice = cartDta?.data.totalPriceAfterDiscount || cartDta?.data.totalCartPrice || 0;
  const hasDiscount = !!(cartDta?.data.totalPriceAfterDiscount && cartDta.data.totalPriceAfterDiscount !== cartDta.data.totalCartPrice);
  const discountAmount = hasDiscount ? (cartDta?.data.totalCartPrice || 0) - (cartDta?.data.totalPriceAfterDiscount || 0) : 0;

  const handleCheckout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartId', cartDta?.data._id || '');
      sessionStorage.setItem('cartTotal', finalPrice.toString());
    }
    router.push('/checkout/step1-address');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (isError || isCartEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center py-10 w-full max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/" 
            className="block w-full sm:inline-block px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        
        {/* Breadcrumb - Hidden on very small screens to save space */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Shopping Cart</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Products List */}
          <div className="lg:col-span-2 space-y-6">
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Shopping Cart</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{cartDta.numOfCartItems} items reserved for you</p>
            </header>

            <div className="space-y-4">
              {cartDta.data.products.map((pro) => (
                <div 
                  key={pro._id} 
                  className={`relative flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all ${
                    deleteMutation.isPending || updateCartMutation.isPending ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {/* Image Container */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                    <img 
                      src={pro.product.imageCover} 
                      alt={pro.product.title} 
                      className="w-full h-full object-contain p-2" 
                    />
                  </div>
                  
                  {/* Info Container */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{pro.product.title}</h3>
                    <p className="text-sm text-green-600 dark:text-green-500 font-medium mb-3">
                      {pro.product.category?.name || 'General'}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <button 
                          onClick={() => handleUpdate(pro.product._id, pro.count - 1)}
                          className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-bold transition-colors"
                        >−</button>
                        <span className="px-4 py-1 font-bold text-gray-900 dark:text-white">{pro.count}</span>
                        <button 
                          onClick={() => handleUpdate(pro.product._id, pro.count + 1)}
                          className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-bold transition-colors"
                        >+</button>
                      </div>

                      <div className="text-lg font-black text-gray-900 dark:text-white">
                        {pro.price} <span className="text-sm font-normal text-gray-500">EGP</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button - Positioned top-right on mobile */}
                  <button 
                    onClick={() => deleteMutation.mutate(pro.product._id)}
                    className="absolute top-4 right-4 sm:static p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <MdDelete size={28} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Have a promo code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CODE20"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 focus:border-green-500 outline-none transition-all uppercase font-bold"
                  />
                  <button
                    type="submit"
                    disabled={couponMutation.isPending || !couponCode.trim()}
                    className="px-6 bg-gray-900 dark:bg-green-700 text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Price Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{cartDta.data.totalCartPrice} EGP</span>
                </div>
                
                {hasDiscount && (
                  <div className="flex justify-between text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <span>Discount Applied</span>
                    <span className="font-bold">-{discountAmount.toFixed(2)} EGP</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-bold italic">FREE</span>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <span className="text-lg font-bold">Total Amount</span>
                  <div className="text-right">
                    {hasDiscount && (
                      <div className="text-sm text-gray-400 line-through mb-1">{cartDta.data.totalCartPrice} EGP</div>
                    )}
                    <div className="text-3xl font-black text-green-600">{finalPrice} EGP</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:bg-green-700 hover:-translate-y-1 transition-all"
                >
                  Proceed to Checkout
                </button>
                
                <Link 
                  href="/" 
                  className="block w-full text-center text-gray-500 font-bold hover:text-gray-900 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center justify-center gap-3 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">🛡️ 100% Secure</span>
                <span className="flex items-center gap-1">💳 Flexible Payment</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
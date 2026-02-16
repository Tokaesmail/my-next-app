'use client'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiArrowRight, HiArrowLeft, HiCube } from 'react-icons/hi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';

interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: {
      name: string;
    };
    brand: {
      name: string;
    };
  };
}

interface Props {
  cartItems: CartItem[];
  totalPrice: number;
  cartId: string;
  token: string;
}

export default function OrderReviewClient({ cartItems, totalPrice, cartId, token }: Props) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    setIsProcessing(true);
    // Store cart info for next steps
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartId', cartId);
      sessionStorage.setItem('totalPrice', totalPrice.toString());
    }
    router.push('/checkout/step3-payment');
  };

  const handleBack = () => {
    router.push('/checkout/step1-address');
  };

  return (
    <>
      <ProgressStepper currentStep={2} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <HiShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Review Your Order</h2>
            <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <HiCube className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some items to continue shopping</p>
              <button
                onClick={() => router.push('/products')}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200 bg-linear-to-br from-white to-purple-50/30"
                >
                  {/* Product Image */}
                  <div className="relative group">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {item.count}
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 line-clamp-2">
                      {item.product.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {item.product.brand?.name}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {item.product.category?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Quantity: <span className="font-bold text-gray-900">{item.count}</span> × 
                      <span className="font-bold text-indigo-600"> ${item.price.toFixed(2)}</span>
                    </p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                      ${(item.price * item.count).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Order Summary */}
              <div className="mt-8 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-indigo-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Shipping:</span>
                    <span className="text-xl font-bold text-green-600">FREE</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Tax:</span>
                    <span className="text-xl font-bold text-gray-900">$0.00</span>
                  </div>
                  
                  <div className="border-t-2 border-indigo-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-gray-900">Total:</span>
                      <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-lg transition-all bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 shadow-md hover:shadow-lg"
          >
            <HiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="flex items-center gap-3 px-8 py-4 md:px-10 md:py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <HiArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </>
            )}
          </button>
        </motion.div>
      )}
    </>
  );
}
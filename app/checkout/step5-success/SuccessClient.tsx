'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiShoppingBag,
  HiHome,
  HiClipboardList,
  HiSparkles
} from 'react-icons/hi';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';
import Confetti from 'react-confetti';

interface Props {
  token: string;
}

export default function SuccessClient({ token }: Props) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get order details from sessionStorage
    if (typeof window !== 'undefined') {
      setOrderId(sessionStorage.getItem('orderId') || 'ORDER-' + Date.now());
      setPaymentMethod(sessionStorage.getItem('paymentMethod') as 'cash' | 'online');
      
      // Set window size for confetti
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleViewOrders = () => {
    // Clear checkout session data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedAddressId');
      sessionStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('cartId');
      sessionStorage.removeItem('totalPrice');
      sessionStorage.removeItem('orderId');
    }
    router.push('/orders');
  };

  const handleContinueShopping = () => {
    // Clear checkout session data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedAddressId');
      sessionStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('cartId');
      sessionStorage.removeItem('totalPrice');
      sessionStorage.removeItem('orderId');
    }
    router.push('/products');
  };

  const handleGoHome = () => {
    // Clear checkout session data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedAddressId');
      sessionStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('cartId');
      sessionStorage.removeItem('totalPrice');
      sessionStorage.removeItem('orderId');
    }
    router.push('/');
  };

  return (
    <>
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <ProgressStepper currentStep={5} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Success Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="relative inline-block mb-8"
          >
            <div className="w-32 h-32 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <HiCheckCircle className="w-20 h-20 text-white" />
            </div>
            
            {/* Sparkles around icon */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute inset-0"
            >
              <HiSparkles className="absolute top-0 right-0 w-8 h-8 text-yellow-400" />
              <HiSparkles className="absolute bottom-0 left-0 w-6 h-6 text-green-400" />
              <HiSparkles className="absolute top-1/2 left-0 w-7 h-7 text-emerald-400" />
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-3">
              Thank you for your purchase!
            </p>
            
            {orderId && (
              <div className="inline-block bg-linear-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-2xl border-2 border-indigo-100 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-xl font-mono font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  {orderId}
                </p>
              </div>
            )}
          </motion.div>

          {/* Payment Method Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-green-100 mb-8 max-w-2xl mx-auto"
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              {paymentMethod === 'cash' 
                ? '💵 Your order will be delivered soon. Please keep the exact amount ready for payment on delivery.'
                : '💳 Payment processed successfully. You will receive a confirmation email with your order details shortly.'
              }
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleViewOrders}
              className="group flex items-center gap-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <HiClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
              View My Orders
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Continue Shopping
            </button>

            <button
              onClick={handleGoHome}
              className="group flex items-center gap-3 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto"
            >
              <HiHome className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Go Home
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-500 text-sm">
              Need help? Contact our support team at <span className="font-semibold text-indigo-600">support@shop.com</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
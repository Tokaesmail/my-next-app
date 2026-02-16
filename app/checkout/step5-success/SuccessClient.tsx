'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  HiCheckCircle, 
  HiShoppingBag,
  HiHome,
  HiClipboardList,
  HiSparkles
} from 'react-icons/hi';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';

// ✅ Import Confetti dynamically to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

interface Props {
  token: string;
}

export default function SuccessClient({ token }: Props) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      setOrderId(sessionStorage.getItem('orderId') || 'ORDER-' + Date.now());
      setPaymentMethod(sessionStorage.getItem('paymentMethod') as 'cash' | 'online');
      
      // Set initial window size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      // Handle window resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);

      // Stop confetti after 8 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const clearSessionAndNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedAddressId');
      sessionStorage.removeItem('paymentMethod');
      sessionStorage.removeItem('cartId');
      sessionStorage.removeItem('totalPrice');
      sessionStorage.removeItem('orderId');
    }
    router.push(path);
  };

  return (
    <>
      {/* Confetti Animation */}
      {isMounted && showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#14b8a6']}
        />
      )}

      <ProgressStepper currentStep={5} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-green-900/20 p-8 md:p-12 border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-green-200/20 to-emerald-200/20 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-br from-teal-200/20 to-cyan-200/20 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>

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
            {/* Main Circle */}
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                  '0 0 60px rgba(16, 185, 129, 0.6)',
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <HiCheckCircle className="w-20 h-20 text-white" />
            </motion.div>
            
            {/* Sparkles around icon */}
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HiSparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 dark:text-yellow-500" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <HiSparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-green-400 dark:text-green-500" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              >
                <HiSparkles className="absolute top-1/2 -left-4 w-7 h-7 text-emerald-400 dark:text-emerald-500" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
              >
                <HiSparkles className="absolute top-1/2 -right-4 w-7 h-7 text-teal-400 dark:text-teal-500" />
              </motion.div>
            </motion.div>

            {/* Pulse effects */}
            <motion.div
              animate={{ 
                scale: [1, 1.6, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-green-500 rounded-full -z-10"
            />

            <motion.div
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
            />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Order Placed Successfully! 🎉
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
              Thank you for your purchase!
            </p>
            
            {orderId && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="inline-block bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 px-6 py-3 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 mb-6"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                <p className="text-xl font-mono font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {orderId}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Payment Method Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 p-6 rounded-2xl border-2 border-green-100 dark:border-green-900 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-3">
              <motion.div 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3, delay: 1 }}
              >
                {paymentMethod === 'cash' ? '💵' : '💳'}
              </motion.div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-1">
                {paymentMethod === 'cash' 
                  ? 'Your order will be delivered soon. Please keep the exact amount ready for payment on delivery.'
                  : 'Payment processed successfully. You will receive a confirmation email with your order details shortly.'
                }
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => clearSessionAndNavigate('/orders')}
              className="group flex items-center gap-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl w-full sm:w-auto"
            >
              <HiClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
              View My Orders
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => clearSessionAndNavigate('/')}
              className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <HiShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Continue Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => clearSessionAndNavigate('/')}
              className="group flex items-center gap-3 bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto"
            >
              <HiHome className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Go Home
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.svg 
                className="w-5 h-5 text-green-600 dark:text-green-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2, delay: 1.5 }}
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </motion.svg>
              <span className="font-semibold text-gray-900 dark:text-gray-100">Your order is confirmed</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@shop.com" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                support@shop.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
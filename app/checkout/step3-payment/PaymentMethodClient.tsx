'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiCreditCard, HiCash, HiCheck, HiArrowRight, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';

interface Props {
  token: string;
}

export default function PaymentMethodClient({ token }: Props) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('paymentMethod', paymentMethod);
    }
    router.push('/checkout/step4-confirm');
  };

  const handleBack = () => {
    router.push('/checkout/step2-review');
  };

  return (
    <>
      <ProgressStepper currentStep={3} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-pink-900/20 p-6 md:p-8 border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <HiCreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Payment Method</h2>
            <p className="text-gray-600 dark:text-gray-400">Choose how you'd like to pay</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Cash on Delivery */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('cash')}
            className={`
              relative p-8 rounded-2xl border-3 cursor-pointer transition-all duration-300 overflow-hidden
              ${paymentMethod === 'cash'
                ? 'border-green-500 dark:border-green-600 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-2xl ring-4 ring-green-200 dark:ring-green-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <HiCash className="w-full h-full text-green-600" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  paymentMethod === 'cash' 
                    ? 'bg-linear-to-br from-green-500 to-emerald-600' 
                    : 'bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                }`}>
                  <HiCash className={`w-9 h-9 ${paymentMethod === 'cash' ? 'text-white' : 'text-green-600 dark:text-green-500'}`} />
                </div>
                
                {paymentMethod === 'cash' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
                  >
                    <HiCheck className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">
                Cash on Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Pay with cash when your order arrives at your doorstep. Simple and convenient!
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>No online transaction needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>Pay when you receive</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>100% secure delivery</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Online Payment */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('online')}
            className={`
              relative p-8 rounded-2xl border-3 cursor-pointer transition-all duration-300 overflow-hidden
              ${paymentMethod === 'online'
                ? 'border-blue-500 dark:border-blue-600 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-2xl ring-4 ring-blue-200 dark:ring-blue-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <HiCreditCard className="w-full h-full text-blue-600" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  paymentMethod === 'online' 
                    ? 'bg-linear-to-br from-blue-500 to-indigo-600' 
                    : 'bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                }`}>
                  <HiCreditCard className={`w-9 h-9 ${paymentMethod === 'online' ? 'text-white' : 'text-blue-600 dark:text-blue-500'}`} />
                </div>
                
                {paymentMethod === 'online' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                  >
                    <HiCheck className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">
                Online Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Pay securely with credit/debit card or digital wallet. Fast and encrypted!
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span>Instant payment confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span>Secure encrypted transaction</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-3 p-6 bg-linear-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <HiShieldCheck className="w-8 h-8 text-green-600 dark:text-green-500" />
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Secure Payment</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your payment information is always protected</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-lg transition-all bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg"
        >
          <HiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!paymentMethod || isProcessing}
          className="flex items-center gap-3 px-8 py-4 md:px-10 md:py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Continue to Confirm
              <HiArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </>
          )}
        </button>
      </motion.div>
    </>
  );
}
'use client'
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, 
  HiShoppingCart, 
  HiCreditCard, 
  HiCheckCircle,
  HiCheck
} from 'react-icons/hi';

const CHECKOUT_STEPS = [
  { id: 1, name: 'Address', icon: HiLocationMarker, path: '/checkout/step1-address' },
  { id: 2, name: 'Review', icon: HiShoppingCart, path: '/checkout/step2-review' },
  { id: 3, name: 'Payment', icon: HiCreditCard, path: '/checkout/step3-payment' },
  { id: 4, name: 'Confirm', icon: HiCheck, path: '/checkout/step4-confirm' },
  { id: 5, name: 'Success', icon: HiCheckCircle, path: '/checkout/step5-success' },
];

interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-indigo-900/20 p-6 md:p-8 border border-gray-100 dark:border-gray-800 mb-8">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-8 left-0 h-1 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (CHECKOUT_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {CHECKOUT_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                {/* Circle Icon */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isCompleted 
                      ? '#10b981' 
                      : isActive 
                      ? '#6366f1' 
                      : '#e5e7eb',
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 relative z-10 shadow-lg dark:shadow-none"
                  style={{
                    backgroundColor: isCompleted 
                      ? '#10b981' 
                      : isActive 
                      ? '#6366f1' 
                      : undefined
                  }}
                >
                  {isCompleted ? (
                    <HiCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  ) : (
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isActive || isCompleted ? 'text-white' : 'text-gray-400 dark:text-gray-600'}`} />
                  )}
                  
                  {/* Pulse Animation for Active Step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-indigo-600 dark:bg-indigo-500"
                      animate={{ 
                        scale: [1, 1.4, 1], 
                        opacity: [0.6, 0, 0.6] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="text-center">
                  <motion.p 
                    className={`font-bold text-xs md:text-sm transition-colors duration-300 ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : isCompleted 
                        ? 'text-green-600 dark:text-green-500' 
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                    }}
                  >
                    {step.name}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
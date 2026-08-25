'use client'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
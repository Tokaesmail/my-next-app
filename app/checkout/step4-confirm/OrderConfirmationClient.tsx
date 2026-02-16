'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HiExclamationCircle, 
  HiLocationMarker, 
  HiCreditCard, 
  HiCash,
  HiShoppingCart,
  HiArrowLeft,
  HiCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

interface Props {
  addresses: Address[];
  token: string;
}

export default function OrderConfirmationClient({ addresses, token }: Props) {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Retrieve stored data from sessionStorage
    if (typeof window !== 'undefined') {
      setSelectedAddressId(sessionStorage.getItem('selectedAddressId'));
      setPaymentMethod(sessionStorage.getItem('paymentMethod') as 'cash' | 'online');
      setCartId(sessionStorage.getItem('cartId'));
      setTotalPrice(parseFloat(sessionStorage.getItem('totalPrice') || '0'));
    }
  }, []);

  const selectedAddress = addresses.find(a => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod || !cartId) {
      toast.error('Missing order information');
      return;
    }

    setIsPlacingOrder(true);

    try {
      if (paymentMethod === 'cash') {
        // Create Cash Order API call
        const response = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token,
            },
            body: JSON.stringify({
              shippingAddress: {
                details: selectedAddress.details,
                phone: selectedAddress.phone,
                city: selectedAddress.city,
              }
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create cash order');
        }

        const data = await response.json();
        
        // Store order ID and navigate to success page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('orderId', data.data?._id || 'ORDER-' + Date.now());
        }
        
        toast.success('Order placed successfully! 🎉');
        router.push('/checkout/step5-success');

      } else if (paymentMethod === 'online') {
        // Create Checkout Session for online payment
        const response = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}/checkout/step5-success`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token,
            },
            body: JSON.stringify({
              shippingAddress: {
                details: selectedAddress.details,
                phone: selectedAddress.phone,
                city: selectedAddress.city,
              }
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        
        // Redirect to payment gateway
        if (data.session?.url) {
          window.location.href = data.session.url;
        } else {
          throw new Error('Payment URL not received');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  const handleBack = () => {
    router.push('/checkout/step3-payment');
  };

  if (!selectedAddress || !paymentMethod) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <>
      <ProgressStepper currentStep={4} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <HiExclamationCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Confirm Your Order</h2>
            <p className="text-gray-600">Review your order details before placing</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100"
          >
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <HiLocationMarker className="w-5 h-5 text-white" />
              </div>
              Delivery Address
            </h3>
            <div className="ml-13 space-y-2 text-gray-700">
              <p className="font-bold text-lg text-gray-900">{selectedAddress.name}</p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 min-w-20">City:</span>
                {selectedAddress.city}
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 min-w-20">Phone:</span>
                <span className="font-mono">{selectedAddress.phone}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 min-w-20">Address:</span>
                <span className="flex-1">{selectedAddress.details}</span>
              </p>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-linear-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-100"
          >
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                paymentMethod === 'cash' 
                  ? 'bg-linear-to-br from-green-500 to-emerald-600' 
                  : 'bg-linear-to-br from-blue-500 to-indigo-600'
              }`}>
                {paymentMethod === 'cash' ? (
                  <HiCash className="w-5 h-5 text-white" />
                ) : (
                  <HiCreditCard className="w-5 h-5 text-white" />
                )}
              </div>
              Payment Method
            </h3>
            <div className="ml-13">
              <p className="text-lg font-bold text-gray-900">
                {paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Online Payment'}
              </p>
              <p className="text-gray-600 mt-1">
                {paymentMethod === 'cash' 
                  ? 'Pay with cash when your order arrives' 
                  : 'You will be redirected to secure payment gateway'
                }
              </p>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100"
          >
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                <HiShoppingCart className="w-5 h-5 text-white" />
              </div>
              Order Summary
            </h3>
            <div className="ml-13 space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-700">Tax:</span>
                <span className="font-bold text-gray-900">$0.00</span>
              </div>
              <div className="border-t-2 border-blue-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-gray-900">Total:</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-linear-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 flex items-start gap-4"
          >
            <HiExclamationCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-1">Important Notice:</p>
              <p>
                By placing this order, you agree to our terms and conditions. 
                {paymentMethod === 'cash' && ' Please keep the exact amount ready for payment on delivery.'}
                {paymentMethod === 'online' && ' You will be securely redirected to complete your payment.'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={handleBack}
          disabled={isPlacingOrder}
          className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-lg transition-all bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <HiArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          Back
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="flex items-center gap-3 px-10 py-4 md:px-12 md:py-5 rounded-xl font-black text-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-7 w-7 border-t-3 border-b-3 border-white"></div>
              Processing Order...
            </>
          ) : (
            <>
              <HiCheck className="w-7 h-7" />
              Place Order Now
            </>
          )}
        </button>
      </motion.div>
    </>
  );
}
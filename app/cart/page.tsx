import Image from 'next/image'
import React from 'react'
import { MdDelete } from 'react-icons/md'

export default function Cart() {
  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-7xl">
  {/* Breadcrumb */}
  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
    <a href="/" className="hover:text-green-600">
      Home
    </a>
    <span>›</span>
    <span className="text-gray-900 font-medium">Shopping Cart</span>
  </div>
  <div className="grid lg:grid-cols-3 gap-8">
    {/* Left Side - Cart Items & Coupon */}
    <div className="lg:col-span-2 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">3 items in your cart</p>
      </div>
      {/* Cart Item 1 */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200"
            alt="Apples"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Organic Fresh Apples (1kg)
          </h3>
          <p className="text-sm text-gray-500 mb-2">Fruits &amp; Vegetables</p>
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg
                className="w-4 h-4 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">4.3 (149)</span>
          </div>
        </div>
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-2 py-1">
          <button className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl">
            −
          </button>
          <span className="w-8 text-center font-medium">2</span>
          <button className="text-gray-600 hover:text-gray-900 w-6 h-6 flex items-center justify-center text-xl">
            +
          </button>
        </div>
        {/* Price */}
        <div className="text-right min-w-25">
          <div className="font-bold text-gray-900 text-lg">$7.98</div>
          <div className="text-sm text-gray-400 line-through">$10.98</div>
        </div>
        {/* Remove Button */}
        <button
          className="text-red-500 hover:text-red-700 p-2"
          aria-label="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* Coupon Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Apply Coupon</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Apply
          </button>
        </div>
        {/* Applied Coupon */}
        <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-700 font-medium">FRESH20 Applied</span>
          </div>
          <span className="text-green-700 font-semibold">-$3.25</span>
        </div>
      </div>
    </div>
    {/* Right Side - Order Summary */}
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
        {/* Summary Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (3 items)</span>
            <span className="font-medium">$16.26</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount (FRESH20)</span>
            <span className="font-medium text-green-600">-$3.25</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="font-medium">$1.04</span>
          </div>
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>$14.05</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            Proceed to Checkout
          </button>
          <button className="w-full bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            Continue Shopping
          </button>
        </div>
        {/* Free Delivery Info */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600 mt-0.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">
                Free Delivery
              </h4>
              <p className="text-sm text-green-700">
                Your order qualifies for free delivery. Estimated delivery: 2-3
                business days
              </p>
            </div>
          </div>
        </div>
        {/* Secure Checkout Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 mt-0.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Secure Checkout
              </h4>
              <p className="text-sm text-gray-600">
                Your payment information is protected with 256-bit SSL
                encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

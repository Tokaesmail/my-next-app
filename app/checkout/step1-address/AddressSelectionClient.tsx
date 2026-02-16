'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiHome, HiOfficeBuilding, HiCheck, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ProgressStepper from '../../_components/ProgressStepper/ProgressStepper';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

interface Props {
  addresses: Address[];
  preselectedId?: string;
  token: string;
}

export default function AddressSelectionClient({ addresses, preselectedId, token }: Props) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(preselectedId || null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsProcessing(true);
    // Store selected address in sessionStorage for next steps
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedAddressId', selectedAddress);
    }
    
    // Navigate to step 2
    router.push('/checkout/step2-review');
  };

  const handleAddNewAddress = () => {
    router.push('/addresses?redirect=/checkout/step1-address');
  };

  return (
    <>
      <ProgressStepper currentStep={1} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <HiLocationMarker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Delivery Address</h2>
            <p className="text-gray-600">Where should we deliver your order?</p>
          </div>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLocationMarker className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Addresses Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to add a delivery address before proceeding with checkout
            </p>
            <button
              onClick={handleAddNewAddress}
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {addresses.map((address, index) => (
                <motion.div
                  key={address._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedAddress(address._id)}
                  className={`
                    p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${selectedAddress === address._id 
                      ? 'border-indigo-600 bg-linear-to-br from-indigo-50 to-purple-50 shadow-xl ring-4 ring-indigo-200' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg bg-white'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        selectedAddress === address._id 
                          ? 'bg-linear-to-br from-indigo-500 to-purple-600' 
                          : 'bg-gray-100'
                      }`}>
                        {address.name.toLowerCase().includes('home') ? (
                          <HiHome className={`w-6 h-6 ${selectedAddress === address._id ? 'text-white' : 'text-indigo-600'}`} />
                        ) : address.name.toLowerCase().includes('office') ? (
                          <HiOfficeBuilding className={`w-6 h-6 ${selectedAddress === address._id ? 'text-white' : 'text-blue-600'}`} />
                        ) : (
                          <HiLocationMarker className={`w-6 h-6 ${selectedAddress === address._id ? 'text-white' : 'text-purple-600'}`} />
                        )}
                      </div>
                      
                      {/* Address Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {address.name}
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-20 text-gray-900">City:</span>
                            <span>{address.city}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-20 text-gray-900">Phone:</span>
                            <span className="font-mono">{address.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-20 text-gray-900">Address:</span>
                            <span className="flex-1">{address.details}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected Badge */}
                    {selectedAddress === address._id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                      >
                        <HiCheck className="w-5 h-5" />
                        Selected
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Address Link */}
            <button
              onClick={handleAddNewAddress}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-semibold text-lg"
            >
              + Add New Address
            </button>
          </>
        )}
      </motion.div>

      {/* Continue Button */}
      {addresses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mt-8"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedAddress || isProcessing}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                Continue to Review
                <HiArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </motion.div>
      )}
    </>
  );
}
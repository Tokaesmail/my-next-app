'use client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiPlus, HiPencil, HiTrash, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

interface AddressesResponse {
  status: string;
  data: Address[];
}

export default function UserAddressesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userToken = (session as any)?.token;

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  // Fetch addresses
  const { data: addressesData, isLoading } = useQuery<AddressesResponse>({
    queryKey: ['user-addresses'],
    queryFn: async () => {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
        headers: { token: userToken },
      });
      if (!response.ok) throw new Error('Failed to fetch addresses');
      return response.json();
    },
    enabled: !!userToken,
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': userToken,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add address');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address added successfully!');
      setIsAddingNew(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add address');
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { token: userToken },
      });
      if (!response.ok) throw new Error('Failed to delete address');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete address');
    },
  });

  const resetForm = () => {
    setFormData({ name: '', details: '', phone: '', city: '' });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details || !formData.phone || !formData.city) {
      toast.error('Please fill all fields');
      return;
    }
    addAddressMutation.mutate(formData);
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    // Navigate to checkout with selected address
    router.push(`/checkout?addressId=${selectedAddress}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const addresses = addressesData?.data || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                Delivery Addresses
                <HiLocationMarker className="inline-block ml-3 text-green-600" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your delivery locations
              </p>
            </div>

            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold"
            >
              <HiPlus className="w-5 h-5" />
              Add New Address
            </button>
          </div>
        </motion.div>

        {/* Add New Address Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Address</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Home, Office"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g., Cairo, Giza"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01234567890"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Address Details
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Building number, street name, floor, apartment..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={addAddressMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {addAddressMutation.isPending ? 'Adding...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <HiLocationMarker className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Addresses Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first delivery address to continue</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAddress(address._id)}
                className={`
                  bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200
                  ${selectedAddress === address._id 
                    ? 'border-green-600 shadow-lg ring-2 ring-green-200 dark:ring-green-900' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {address.name.toLowerCase().includes('home') ? (
                        <HiHome className="w-6 h-6 text-green-600" />
                      ) : (
                        <HiOfficeBuilding className="w-6 h-6 text-blue-600" />
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {address.name}
                      </h3>
                      {selectedAddress === address._id && (
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                          <HiCheck className="w-4 h-4" />
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">City:</span>
                        {address.city}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">Phone:</span>
                        {address.phone}
                      </p>
                      <p className="mt-2">{address.details}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddressMutation.mutate(address._id);
                      }}
                      disabled={deleteAddressMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Proceed Button */}
        {addresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedAddress}
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
            >
              {selectedAddress ? 'Proceed to Checkout' : 'Select an Address to Continue'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
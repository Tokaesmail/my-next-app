'use client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiPlus, HiPencil, HiTrash, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface SingleAddressResponse {
  status: string;
  data: Address;
}

export default function UserAddressesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const userToken = (session as any)?.token;

  // ✅ Check if coming from checkout
  const redirectUrl = searchParams?.get('redirect');
  const isFromCheckout = redirectUrl?.includes('checkout');

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [viewingAddressId, setViewingAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  // Fetch all addresses
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

  // Fetch specific address
  const { data: specificAddressData } = useQuery<SingleAddressResponse>({
    queryKey: ['address', viewingAddressId],
    queryFn: async () => {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${viewingAddressId}`, {
        headers: { token: userToken },
      });
      if (!response.ok) throw new Error('Failed to fetch address');
      return response.json();
    },
    enabled: !!viewingAddressId && !!userToken,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address added successfully! ✅');
      setIsAddingNew(false);
      resetForm();
      
      // ✅ If from checkout, redirect back with new address selected
      if (isFromCheckout && redirectUrl && data.data?._id) {
        router.push(`${redirectUrl}?preselected=${data.data._id}`);
      }
    },
    onError: () => {
      toast.error('Failed to add address ❌');
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': userToken,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update address');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address updated successfully! ✅');
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update address ❌');
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
      toast.success('Address deleted successfully! 🗑️');
    },
    onError: () => {
      toast.error('Failed to delete address ❌');
    },
  });

  const resetForm = () => {
    setFormData({ name: '', details: '', phone: '', city: '' });
    setEditingId(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setEditingId(address._id);
    setIsAddingNew(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details || !formData.phone || !formData.city) {
      toast.error('Please fill all fields');
      return;
    }

    if (editingId) {
      updateAddressMutation.mutate({ id: editingId, data: formData });
    } else {
      addAddressMutation.mutate(formData);
    }
  };

  // ✅ UPDATED: Proceed to correct checkout page
  const handleProceedToCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    // ✅ If redirect URL exists (from checkout), go back there
    if (redirectUrl) {
      router.push(`${redirectUrl}?preselected=${selectedAddress}`);
    } else {
      // ✅ Otherwise, start new checkout flow
      router.push(`/checkout/step1-address?preselected=${selectedAddress}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading addresses...</p>
        </div>
      </div>
    );
  }

  const addresses = addressesData?.data || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3"
          >
            <HiLocationMarker className="w-10 h-10 text-green-600" />
            Delivery Addresses
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isFromCheckout 
              ? '📦 Select or add an address to continue with checkout' 
              : `Manage your delivery locations (${addresses.length} address${addresses.length !== 1 ? 'es' : ''})`
            }
          </p>
        </div>

        {/* Add New Address Button */}
        {!isAddingNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <HiPlus className="w-6 h-6" />
              Add New Address
            </button>
          </motion.div>
        )}

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingId ? '✏️ Edit Address' : '➕ Add New Address'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <HiX className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Home, Office, etc."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Cairo, Alexandria, etc."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
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
                      Full Address Details *
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Building number, street name, floor, apartment, landmarks..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {(addAddressMutation.isPending || updateAddressMutation.isPending) ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          {editingId ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <HiCheck className="w-5 h-5" />
                          {editingId ? 'Update Address' : 'Save Address'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <HiLocationMarker className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Addresses Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first delivery address to continue shopping</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              Add First Address
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAddress(address._id)}
                className={`
                  bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200
                  ${selectedAddress === address._id 
                    ? 'border-green-600 shadow-lg ring-2 ring-green-200 dark:ring-green-900' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {address.name.toLowerCase().includes('home') ? (
                        <HiHome className="w-6 h-6 text-green-600" />
                      ) : address.name.toLowerCase().includes('office') ? (
                        <HiOfficeBuilding className="w-6 h-6 text-blue-600" />
                      ) : (
                        <HiLocationMarker className="w-6 h-6 text-purple-600" />
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
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-900 dark:text-white min-w-20">City:</span>
                        {address.city}
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-900 dark:text-white min-w-20">Phone:</span>
                        {address.phone}
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-900 dark:text-white min-w-20">Address:</span>
                        <span className="flex-1">{address.details}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit address"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this address?')) {
                          deleteAddressMutation.mutate(address._id);
                        }
                      }}
                      disabled={deleteAddressMutation.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete address"
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
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {selectedAddress ? (
                <>
                  <HiCheck className="w-6 h-6" />
                  {isFromCheckout ? 'Continue with Selected Address' : 'Proceed to Checkout'}
                </>
              ) : (
                'Select an Address to Continue'
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
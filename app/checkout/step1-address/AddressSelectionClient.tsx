'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiLocationMarker, HiHome, HiOfficeBuilding, HiCheck, 
  HiArrowRight, HiPlus, HiPencil, HiTrash, HiX 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  preselectedId?: string;
  token: string;
}

export default function AddressSelectionClient({ addresses, preselectedId, token }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // States
  const [selectedAddress, setSelectedAddress] = useState<string | null>(preselectedId || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  // --- Operations (Mutations) using Endpoints ---

  // 1. Add New Address
  const addAddressMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address added successfully! ✅');
      resetForm();
      router.refresh();
    },
    onError: () => toast.error('Failed to add address ❌')
  });

  // 2. Delete Address
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'token': token },
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address deleted successfully 🗑️');
      router.refresh();
    },
    onError: () => toast.error('Failed to delete address ❌')
  });

  // 3. Update Address
  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Address updated successfully ✅');
      resetForm();
      router.refresh();
    },
    onError: () => toast.error('Failed to update address ❌')
  });

  // --- Handlers ---

  const resetForm = () => {
    setFormData({ name: '', details: '', phone: '', city: '' });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setEditingId(address._id);
    setIsAddingNew(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details || !formData.phone || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      updateAddressMutation.mutate({ id: editingId, data: formData });
    } else {
      addAddressMutation.mutate(formData);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setIsProcessing(true);
    sessionStorage.setItem('selectedAddressId', selectedAddress);
    router.push('/checkout/step2-review');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressStepper currentStep={1} />

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiLocationMarker className="text-indigo-600" />
              Delivery Address
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Select or add a delivery location</p>
          </div>
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              <HiPlus /> Add New
            </button>
          )}
        </div>

        {/* Form Section */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{editingId ? 'Edit Address' : 'New Address'}</h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-red-500"><HiX size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Address Name (e.g., Home)" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
                      placeholder="City" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <input 
                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <textarea 
                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Detailed Address (Street, Building, Floor...)" 
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                  <button 
                    type="submit"
                    disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                  >
                    {addAddressMutation.isPending || updateAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses List */}
        <div className="grid grid-cols-1 gap-4">
          {addresses.length === 0 && !isAddingNew ? (
            <div className="text-center py-10 border-2 border-dashed rounded-2xl text-gray-400">
              No addresses found. Please add a new address.
            </div>
          ) : (
            addresses.map((address) => (
              <motion.div
                key={address._id}
                onClick={() => setSelectedAddress(address._id)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedAddress === address._id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${selectedAddress === address._id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                      {address.name.toLowerCase().includes('office') ? <HiOfficeBuilding size={24}/> : <HiHome size={24}/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{address.name}</h4>
                      <p className="text-sm text-gray-500">{address.city} | {address.phone}</p>
                      <p className="text-sm text-gray-400 mt-1">{address.details}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleEdit(e, address)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <HiPencil size={20}/>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Are you sure you want to delete this address?')) deleteAddressMutation.mutate(address._id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <HiTrash size={20}/>
                    </button>
                  </div>
                </div>

                {selectedAddress === address._id && (
                  <div className="absolute top-4 right-14 text-indigo-600">
                    <HiCheck className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedAddress || isProcessing}
            className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {isProcessing ? 'Loading...' : (
              <>
                Confirm & Continue
                <HiArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
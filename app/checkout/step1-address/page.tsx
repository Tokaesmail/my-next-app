import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AddressSelectionClient from './AddressSelectionClient';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

interface AddressesResponse {
  status: string;
  data: Address[];
}

// Server Component - Fetch addresses on server
async function getAddresses(token: string): Promise<AddressesResponse> {
  try {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
      headers: { 
        'token': token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return { status: 'error', data: [] };
  }
}

export default async function Step1AddressPage({
  searchParams,
}: {
  searchParams: { preselected?: string };
}) {
  // Get token from cookies
  const cookieStore =await cookies();
  const token =cookieStore.get('userToken')?.value || '';

  if (!token) {
    redirect('/login');
  }

  // Fetch addresses on server
  const addressesData = await getAddresses(token);
  const addresses = addressesData?.data || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">Complete your purchase in simple steps</p>
        </div>

        {/* Client Component for interaction */}
        <AddressSelectionClient 
          addresses={addresses} 
          preselectedId={searchParams.preselected}
          token={token}
        />
      </div>
    </div>
  );
}
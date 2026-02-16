import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrderConfirmationClient from './OrderConfirmationClient';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

async function getAddresses(token: string) {
  try {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
      headers: { token },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch addresses');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Step4ConfirmPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('userToken')?.value || '';

  if (!token) {
    redirect('/login');
  }

  const addresses = await getAddresses(token);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Complete your purchase in simple steps</p>
        </div>

        <OrderConfirmationClient addresses={addresses} token={token} />
      </div>
    </div>
  );
}
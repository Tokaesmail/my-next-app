import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PaymentMethodClient from './PaymentMethodClient';

export default async function Step3PaymentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('userToken')?.value || '';

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Complete your purchase in simple steps</p>
        </div>

        <PaymentMethodClient token={token} />
      </div>
    </div>
  );
}
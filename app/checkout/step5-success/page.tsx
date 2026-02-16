import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SuccessClient from './SuccessClient';

export default async function Step5SuccessPage() {
  // Get token from cookies
  const cookieStore =await cookies();
  const token = cookieStore.get('userToken')?.value || '';

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 mb-3">
            Order Complete! 
          </h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        <SuccessClient token={token} />
      </div>
    </div>
  );
}
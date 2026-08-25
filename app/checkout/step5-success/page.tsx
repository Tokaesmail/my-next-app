import { cookies } from 'next/headers';
import SuccessClient from './SuccessClient';

export default async function Step5SuccessPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('userToken')?.value || '';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <SuccessClient token={token} />
      </div>
    </div>
  );
}
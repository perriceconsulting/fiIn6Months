"use client";
import Coach from '@/components/Coach';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }
  const name = user?.email?.split('@')[0] || '';
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {name}</h1>
      <p className="text-lg text-gray-600 text-center max-w-xl mb-8">
        Kick off your personalized 6-month plan to financial freedom. Follow each step, track your progress, and watch your net worth grow.
      </p>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Coach />
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

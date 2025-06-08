"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NavBar() {
  const { user, signOut } = useAuth();
  const name = user?.email?.split('@')[0] || '';
  return (
    <nav className="bg-blue-50 container mx-auto shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <span className="text-gray-700 font-medium">{user ? `Welcome, ${name}` : 'Welcome'}</span>
        <Link href="/" className="font-bold text-lg text-blue-600 hover:text-blue-800">
          Home
        </Link>
        {user && (
          <>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <Link href="/annual" className="text-blue-600 hover:text-blue-800">
              Annual
            </Link>
            <Link href="/monthly" className="text-blue-600 hover:text-blue-800">
              Monthly
            </Link>
            <Link href="/networth" className="text-blue-600 hover:text-blue-800">
              Net Worth
            </Link>
            <Link href="/debt" className="text-blue-600 hover:text-blue-800">
              Debt & Sinking Funds
            </Link>
            <Link href="/accounts" className="text-blue-600 hover:text-blue-800">
              Accounts
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
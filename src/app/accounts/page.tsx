"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Account { name: string; balance: number; }

export default function AccountsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // TODO: Fetch real accounts from Firestore
    setAccounts([
      { name: 'Checking', balance: 1200 },
      { name: 'Savings', balance: 5400 },
      { name: 'Investment', balance: 8300 },
    ]);
  }, [user]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Account</th>
            <th className="px-4 py-2 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{acc.name}</td>
              <td className="px-4 py-2 text-right">
                ${acc.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <Link
          href="/transactions"
          className="text-blue-600 hover:underline"
        >
          View Transactions →
        </Link>
      </div>
    </div>
  );
}

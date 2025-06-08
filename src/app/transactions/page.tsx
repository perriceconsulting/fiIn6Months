"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Transaction {
  date: string;
  account: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // TODO: Fetch transactions from Firestore
    setTxns([
      { date: '2025-06-01', account: 'Checking', description: 'Groceries', amount: 120.45, type: 'debit' },
      { date: '2025-06-03', account: 'Savings', description: 'Salary', amount: 2500, type: 'credit' },
      { date: '2025-06-05', account: 'Checking', description: 'Utilities', amount: 80.12, type: 'debit' },
    ]);
  }, [user]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="space-x-4">
          <Link href="/accounts" className="text-blue-600 hover:underline">
            ← Accounts
          </Link>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </div>
      </div>
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Account</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-center">Type</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((txn, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{txn.date}</td>
              <td className="px-4 py-2">{txn.account}</td>
              <td className="px-4 py-2">{txn.description}</td>
              <td className={`px-4 py-2 text-right ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                ${txn.amount.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center capitalize">{txn.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

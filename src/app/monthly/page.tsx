"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function MonthlyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const name = user?.email?.split('@')[0] || 'there';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <Container className="min-h-screen bg-gray-50 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Hey {name}, Monthly Dashboard</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
      <div className="flex space-x-2 overflow-x-auto border-b pb-2 mb-6">
        {months.map((m, idx) => {
          const monthIndex = idx + 1;
          const isActive = monthIndex === selectedMonth;
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(monthIndex)}
              className={`px-4 py-2 rounded-t-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {m.slice(0, 3)}
            </button>
          );
        })}
      </div>
      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{months[selectedMonth - 1]}</h2>
        <p className="text-gray-600">
          Metrics and charts for <span className="font-medium">{months[selectedMonth - 1]}</span> will appear here.
        </p>
      </Card>
    </Container>
  );
}

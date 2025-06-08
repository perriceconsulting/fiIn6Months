"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DebtPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const name = user?.email?.split('@')[0] || 'there';
  const [activeTab, setActiveTab] = useState<'debt' | 'sinking'>('debt');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Container className="min-h-screen bg-gray-50 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Hey {name}, Debt & Sinking Funds</h1>
        <Button variant="outline" onClick={() => router.push('/')}>Home</Button>
      </div>
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('debt')}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === 'debt'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Debt Payoff
        </button>
        <button
          onClick={() => setActiveTab('sinking')}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === 'sinking'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Sinking Funds
        </button>
      </div>
      <Card>
        {activeTab === 'debt' ? <DebtTool /> : <SinkingTool />}
      </Card>
    </Container>
  );
}

function DebtTool() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(5);
  const [payment, setPayment] = useState<number>(200);
  const [data, setData] = useState<ChartData<'line', number[], string> | null>(null);

  const calculate = () => {
    // Placeholder schedule: linear decrease
    const months = Math.ceil(principal / payment);
    const labels = Array.from({ length: months }, (_, i) => `M${i + 1}`);
    const balances = labels.map((_, i) => Math.max(principal - payment * (i + 1), 0));
    setData({
      labels,
      datasets: [
        {
          label: 'Remaining Balance',
          data: balances,
          borderColor: 'rgba(255,99,132,0.7)',
          backgroundColor: 'rgba(255,99,132,0.3)',
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label>Principal ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-primary-200"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>APR (%)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-primary-200"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Payment ($/mo)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-primary-200"
            value={payment}
            onChange={(e) => setPayment(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <Button variant="primary" onClick={calculate}>Calculate</Button>
      {data && (
        <div className="mt-6">
          <Line
            data={data}
            options={{ responsive: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Debt Payoff Schedule' } } }}
          />
        </div>
      )}
    </div>
  );
}

function SinkingTool() {
  const [goal, setGoal] = useState<number>(1200);
  const [months, setMonths] = useState<number>(12);
  const monthly = (goal && months) ? parseFloat((goal / months).toFixed(2)) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Goal Amount ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-primary-200"
            value={goal}
            onChange={(e) => setGoal(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Timeline (mo)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-primary-200"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <div className="p-4 bg-primary-50 rounded-lg">
        <p className="font-semibold text-primary-700">You need to save ${monthly} per month.</p>
      </div>
    </div>
  );
}

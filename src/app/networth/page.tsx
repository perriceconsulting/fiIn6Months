"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function NetWorthPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ChartData<'doughnut', number[], string>>({ labels: [], datasets: [] });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Prepare dummy net worth data
  useEffect(() => {
    if (!user) return;
    const assetValue = 120000;
    const liabilityValue = 40000;
    setData({
      labels: ['Assets', 'Liabilities'],
      datasets: [
        {
          label: 'Net Worth',
          data: [assetValue, liabilityValue],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderWidth: 1,
        },
      ],
    });
  }, [user]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Net Worth Dashboard</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
      <p className="text-gray-600 mb-6">Visualize your assets versus liabilities.</p>
      <Card>
        <Doughnut
          data={data}
          options={{
            responsive: true,
            plugins: { title: { display: true, text: 'Assets vs Liabilities' } },
          }}
        />
      </Card>
    </Container>
  );
}

"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bar } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnnualPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ChartData<'bar', number[], string>>({ labels: [], datasets: [] });
  const name = user?.email?.split('@')[0] || 'there';

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Prepare dummy annual data for chart
  useEffect(() => {
    if (!user) return;
    const labels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    // Example data: random values or future Firestore fetch
    const values = labels.map(() => Math.floor(Math.random() * 100));
    setData({
      labels,
      datasets: [
        {
          label: 'Monthly Progress (%)',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    });
  }, [user]);

  if (authLoading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Container className="min-h-screen py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Hey {name}, Annual Dashboard</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
      <p className="text-gray-600 mb-6">Visualize your yearly financial progress at a glance.</p>
      <Card>
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' }, title: { display: true, text: 'Yearly Financial Progress' } },
          }}
        />
      </Card>
    </Container>
  );
}

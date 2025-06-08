// filepath: src/app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getUserPlan,
  createUserPlan,
  updateUserPlanStep,
  UserPlan,
  MonthEntry,
} from '@/lib/planService';
import { steps } from '@/data/steps';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  // State for plan data and loading
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load or initialize the user's plan when `user` becomes available
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const init = async () => {
      setLoading(true);
      let existing = await getUserPlan(uid);
      if (!existing) {
        await createUserPlan(uid);
        existing = await getUserPlan(uid);
      }
      setPlan(existing);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Render loading states
  if (authLoading) {
    return <div className="p-4">Loading authentication...</div>;
  }
  if (!user) {
    return null;
  }
  if (loading) {
    return <div className="p-4">Loading your plan...</div>;
  }

  // User is authenticated and plan loaded
  const uid = user.uid;
  const name = user.email?.split('@')[0] || 'there';

  return (
    <Container className="min-h-screen bg-gray-50 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Hey {name}, Your 6-Month Plan</h1>
        <Button variant="outline" onClick={() => router.push('/')}>Home</Button>
      </div>
      <p className="text-gray-600 mb-6">
        Track each month’s task, mark completion, and jot notes to stay on course toward financial freedom.
      </p>
      <ul className="space-y-6">
        {steps.map((description, idx) => {
          const month = idx + 1;
          const entry = plan ? plan[month] : { completed: false, notes: '' };
          return (
            <Card key={month} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">Month {month}</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={entry.completed}
                    onChange={async (e) => {
                      const newEntry: MonthEntry = { ...entry, completed: e.target.checked };
                      setPlan((p) => (p ? { ...p, [month]: newEntry } : p));
                      await updateUserPlanStep(uid, month, { completed: e.target.checked });
                    }}
                  />
                  <span className="text-gray-700">Completed</span>
                </label>
              </div>
              <p className="mb-2 text-gray-600">{description}</p>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200"
                placeholder="Notes..."
                value={entry.notes}
                onChange={(e) => {
                  const value = e.target.value;
                  setPlan((p) =>
                    p ? { ...p, [month]: { ...entry, notes: value } } : p
                  );
                }}
                onBlur={async (e) => {
                  await updateUserPlanStep(uid, month, { notes: e.target.value });
                }}
              />
            </Card>
          );
        })}
      </ul>
    </Container>
  );
}

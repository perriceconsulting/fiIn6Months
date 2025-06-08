"use client";
import React from 'react';
import { steps } from '../data/steps';
import { useState } from 'react';

const clamp = (n: number) => Math.min(Math.max(n, 1), steps.length);

export default function Coach() {
  const [step, setStep] = useState<number>(1);
  const goTo = (n: number) => setStep(clamp(n));

  return (
    <section aria-labelledby="coach-heading" className="p-4">
      <h1 id="coach-heading" className="text-2xl font-bold mb-4">
        Month {step}
      </h1>
      <p className="mb-4">{steps[step - 1]}</p>
      <div className="flex space-x-2">
        <button
          disabled={step === 1}
          onClick={() => goTo(step - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          disabled={step === steps.length}
          onClick={() => goTo(step + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

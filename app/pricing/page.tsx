"use client";

import { Check } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Basic Report",
    price: "4.99",
    priceId: "price_1ShaJN0etceVo13ExQs5Ds3I", // ID-ul tău LIVE pentru Basic
    description: "Get your official IQ score and a brief breakdown.",
    features: [
      "Official IQ Score",
      "Brief Performance Breakdown",
      "Digital Access",
      "Email Support",
    ],
  },
  {
    name: "Full Certified Report",
    price: "14.99",
    priceId: "price_1ShaKA0etceVo13E6AoQ0oHq", // ID-ul tău LIVE pentru Full
    description: "Our most comprehensive analysis with a PDF certificate.",
    features: [
      "Official IQ Score",
      "Detailed Cognitive Analysis",
      "High-Res PDF Certificate",
      "Priority Support",
      "LinkedIn Integration",
    ],
    recommended: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscription = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Report</h1>
        <p className="text-xl text-gray-600">Unlock your full cognitive profile today.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.priceId}
            className={`relative p-8 rounded-2xl border ${
              plan.recommended
                ? "border-blue-600 shadow-xl"
                : "border-gray-200 shadow-sm"
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">one-time</span>
              </div>
              <p className="mt-4 text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscription(plan.priceId)}
              disabled={loading !== null}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.recommended
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              {loading === plan.priceId ? "Processing..." : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState, useCallback } from "react";

const CURRENCY_RATES = { INR: 1, USD: 83 }; // 1 USD ≈ 83 INR

function formatCurrency(amount: number, currency: "INR" | "USD") {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function MeetingCostCalculatorTool() {
  const [attendees, setAttendees] = useState(6);
  const [salary, setSalary] = useState(2000000); // annual
  const [duration, setDuration] = useState(60); // minutes
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const calculate = useCallback(() => {
    const salaryInINR = salary * CURRENCY_RATES[currency];
    const hourlyRatePerPerson = salaryInINR / (52 * 40); // per hour
    const meetingCostINR = attendees * hourlyRatePerPerson * (duration / 60);
    const annualIfWeekly = meetingCostINR * 52;
    const prdEquivalent = meetingCostINR / 200; // rough cost per PRD

    return {
      meetingCost: currency === "INR" ? meetingCostINR : meetingCostINR / 83,
      annualCost: currency === "INR" ? annualIfWeekly : annualIfWeekly / 83,
      prdEquivalent,
      hourlyRate: currency === "INR" ? hourlyRatePerPerson : hourlyRatePerPerson / 83,
    };
  }, [attendees, salary, duration, currency]);

  const { meetingCost, annualCost, prdEquivalent } = calculate();

  const costColor =
    meetingCost < 5000 ? "text-green-600" :
    meetingCost < 20000 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Currency toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Currency:</span>
        {(["INR", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              currency === c
                ? "bg-[#7F77DD] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {c === "INR" ? "₹ INR" : "$ USD"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Attendees
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={attendees}
            onChange={(e) => setAttendees(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">people in the meeting</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Avg annual salary ({currency === "INR" ? "₹" : "$"})
          </label>
          <input
            type="number"
            min={100000}
            step={100000}
            value={salary}
            onChange={(e) => setSalary(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F77DD] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">per person, per year</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Duration (minutes)
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {[15, 30, 45, 60, 90, 120].map((m) => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={`flex-1 min-w-0 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  duration === m
                    ? "bg-[#7F77DD] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="rounded-2xl border-2 border-gray-900 bg-gray-950 p-6 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          This meeting costs
        </p>
        <p className={`text-5xl font-bold mb-1 ${costColor.replace("text-", "text-").replace("600", "400")}`}>
          {formatCurrency(meetingCost, currency)}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {attendees} people × {duration} minutes
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">If weekly for a year</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(annualCost, currency)}</p>
          <p className="text-xs text-gray-400 mt-1">52 meetings × same cost</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">PRDs you could generate</p>
          <p className="text-2xl font-bold text-gray-900">{Math.floor(prdEquivalent)} PRDs</p>
          <p className="text-xs text-gray-400 mt-1">at the cost of this one meeting</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Assumes 52-week, 40-hour work year. PRD cost estimate based on PM hourly rate × 2 hours. For reference only.
      </p>
    </div>
  );
}

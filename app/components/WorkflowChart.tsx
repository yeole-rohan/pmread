"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_DATA = [
  { stage: "Start",       traditional: 0,   pmread: 0   },
  { stage: "Research",    traditional: 120, pmread: 120 },
  { stage: "Transcript",  traditional: 180, pmread: 122 },
  { stage: "Synthesis",   traditional: 270, pmread: 123 },
  { stage: "Patterns",    traditional: 330, pmread: 123 },
  { stage: "Insights",    traditional: 390, pmread: 124 },
  { stage: "Prioritize",  traditional: 435, pmread: 124 },
  { stage: "PRD Draft",   traditional: 675, pmread: 139 },
  { stage: "Citations",   traditional: 765, pmread: 140 },
  { stage: "Handoff",     traditional: 825, pmread: 161 },
];

function fmtMin(m: number) {
  if (m === 0) return "0";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min} min`;
  return min === 0 ? `${h} hr` : `${h} hr ${min} min`;
}

function fmtTick(m: number) {
  if (m === 0) return "0";
  const h = m / 60;
  return Number.isInteger(h) ? `${h}h` : `${Math.round(h * 10) / 10}h`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const trad = payload.find((p: { dataKey: string }) => p.dataKey === "traditional")?.value as number;
  const pm = payload.find((p: { dataKey: string }) => p.dataKey === "pmread")?.value as number;
  const saved = trad - pm;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      <p className="text-gray-400">Traditional: <span className="font-semibold text-gray-600">{fmtMin(trad)}</span></p>
      <p className="text-[#7F77DD]">With PMRead: <span className="font-semibold">{fmtMin(pm)}</span></p>
      {saved > 0 && (
        <p className="text-[#1D9E75] font-semibold mt-1.5 border-t border-gray-100 pt-1.5">
          Saved: {fmtMin(saved)}
        </p>
      )}
    </div>
  );
}

export default function WorkflowChart() {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradTrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="gradPM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7F77DD" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#7F77DD" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis
          dataKey="stage"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={fmtTick}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={36}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) =>
            value === "traditional" ? "Traditional workflow" : "With PMRead"
          }
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />

        <Area
          type="monotone"
          dataKey="traditional"
          stroke="#9ca3af"
          strokeWidth={2}
          fill="url(#gradTrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#9ca3af" }}
        />
        <Area
          type="monotone"
          dataKey="pmread"
          stroke="#7F77DD"
          strokeWidth={2.5}
          fill="url(#gradPM)"
          dot={false}
          activeDot={{ r: 4, fill: "#7F77DD" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

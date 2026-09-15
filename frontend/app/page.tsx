"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";
import { Target, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface Hypothesis {
  id: string;
  rank: number;
  title: string;
  thesis: string;
  posture: "defensive" | "growth" | "expand";
  urgency: number;
  growthPotential: number;
  confidence: "high" | "medium" | "low";
  keyMetric: string;
  keyMetricValue: number;
}

const POSTURE_COLORS = {
  defensive: "#EF4444", // Red
  growth: "#22C55E",    // Green
  expand: "#3B82F6",    // Blue
};

const CONFIDENCE_SIZES = {
  high: 800,
  medium: 300,
  low: 100,
};

export default function PortfolioPage() {
  const router = useRouter();
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hypotheses")
      .then((res) => res.json())
      .then((data) => {
        setHypotheses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hypotheses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="animate-pulse text-sm font-medium text-gray-500">
          Loading Apex Engine Data...
        </div>
      </div>
    );
  }

  const chartData = hypotheses.map((h) => ({
    ...h,
    zSize: CONFIDENCE_SIZES[h.confidence] || CONFIDENCE_SIZES.medium,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 shadow-lg p-4 max-w-xs rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: POSTURE_COLORS[data.posture as keyof typeof POSTURE_COLORS] }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {data.posture}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">{data.title}</p>
          <p className="text-xs text-gray-600 font-mono">
            Metric: {data.keyMetricValue} {data.keyMetric}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] pb-24">
      <header className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">APEX Growth Engine</h1>
            <p className="text-sm text-gray-500 mt-1">
              AI-powered strategic hypothesis engine for Southeast Asian superapp growth
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">
              Portfolio
            </span>
            <span className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 flex items-center gap-1">
              Powered by Claude + n8n
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 mt-12">
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            Strategic Portfolio Map
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm relative h-[500px]">
            <div className="absolute inset-8 pointer-events-none grid grid-cols-2 grid-rows-2">
              <div className="flex items-start justify-start p-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                Urgent but Limited
              </div>
              <div className="flex items-start justify-end p-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                Priority Bets
              </div>
              <div className="flex items-end justify-start p-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                Monitor
              </div>
              <div className="flex items-end justify-end p-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                Long-term Plays
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis 
                  type="number" 
                  dataKey="growthPotential" 
                  name="Growth Potential" 
                  domain={[0, 10]} 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  label={{ value: 'Growth Potential →', position: 'bottom', fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="urgency" 
                  name="Urgency" 
                  domain={[0, 10]} 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  label={{ value: 'Urgency →', angle: -90, position: 'left', fill: '#6B7280', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="zSize" range={[100, 1000]} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                
                <ReferenceLine x={5} stroke="#E5E5E5" />
                <ReferenceLine y={5} stroke="#E5E5E5" />
                
                <Scatter 
                  name="Hypotheses" 
                  data={chartData} 
                  onClick={(e) => router.push(`/hypothesis/${e.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={POSTURE_COLORS[entry.posture as keyof typeof POSTURE_COLORS]} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
            Active Hypotheses ({hypotheses.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {hypotheses.map((h) => (
              <div 
                key={h.id} 
                onClick={() => router.push(`/hypothesis/${h.id}`)}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      {h.rank}
                    </span>
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                      h.posture === 'defensive' && "bg-red-50 text-red-600 border border-red-100",
                      h.posture === 'growth' && "bg-green-50 text-green-600 border border-green-100",
                      h.posture === 'expand' && "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {h.posture}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {h.title}
                </h4>
                
                <div className="mb-4">
                  <span className="font-mono text-sm font-medium bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {h.keyMetricValue} {h.keyMetric}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {h.thesis}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
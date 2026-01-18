"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { TrendingUp, DollarSign, BarChart3, X, ChevronRight } from "lucide-react";
import type { CareerRecommendation } from "@/lib/types/careers";

interface CareerStatsChartProps {
  recommendations: CareerRecommendation[];
}

interface ChartDataPoint {
  name: string;
  fullName: string;
  growth: number;
  avgSalary: number;
  matchScore: number;
  rank: number;
}

// Memoized tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl">
      <p className="font-semibold text-white text-xs mb-2 max-w-[160px] leading-tight">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400 text-[10px]">{entry.name}:</span>
            <span className="text-white font-medium text-[10px]">
              {entry.name === "Growth %" ? `${entry.value}%` : `₹${entry.value}L`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Parse salary range to average
const parseSalary = (range: string): number => {
  const match = range.match(/(\d+)-(\d+)/);
  return match ? (parseInt(match[1]) + parseInt(match[2])) / 2 : 0;
};

// Parse growth percentage
const parseGrowth = (growth: string): number => {
  const match = growth.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

export default function CareerStatsChart({ recommendations }: CareerStatsChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Transform data for chart
  const chartData: ChartDataPoint[] = recommendations.map((rec, index) => ({
    name: rec.career.field_name.length > 12 
      ? rec.career.field_name.substring(0, 10) + "..." 
      : rec.career.field_name,
    fullName: rec.career.field_name,
    growth: parseGrowth(rec.career.demand_growth_2026),
    avgSalary: parseSalary(rec.career.salary_range_inr),
    matchScore: rec.matchScore,
    rank: index + 1,
  }));

  // Calculate stats
  const maxSalary = Math.max(...chartData.map(d => d.avgSalary));
  const maxGrowth = Math.max(...chartData.map(d => d.growth));
  const avgSalary = chartData.reduce((sum, d) => sum + d.avgSalary, 0) / chartData.length;
  const avgGrowth = chartData.reduce((sum, d) => sum + d.growth, 0) / chartData.length;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 group"
      >
        <div className="relative flex items-center">
          {/* Pill Label */}
          <motion.div 
            className="absolute right-full mr-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            initial={false}
          >
            <span className="text-xs text-gray-300">View Analytics</span>
          </motion.div>
          
          {/* Button */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 group-hover:scale-105 transition-all">
            <BarChart3 className="w-5 h-5 text-white" />
            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
            >
              {/* Panel Header */}
              <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Career Analytics</h3>
                  <p className="text-xs text-gray-400">Salary vs Growth Comparison</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-4 space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-[10px] text-green-400/80 uppercase tracking-wide">Top Salary</span>
                    </div>
                    <p className="text-xl font-bold text-green-400">₹{maxSalary}L</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] text-blue-400/80 uppercase tracking-wide">Top Growth</span>
                    </div>
                    <p className="text-xl font-bold text-blue-400">{maxGrowth}%</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-gradient-to-t from-green-700 to-green-500" />
                        <span className="text-[10px] text-gray-400">Salary (LPA)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-[10px] text-gray-400">Growth %</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[280px] -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#15803d" />
                          </linearGradient>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#9ca3af', fontSize: 9 }}
                          tickLine={false}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          angle={-35}
                          textAnchor="end"
                          height={50}
                          interval={0}
                        />
                        
                        <YAxis 
                          yAxisId="salary"
                          orientation="left"
                          tick={{ fill: '#22c55e', fontSize: 9 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `₹${v}`}
                          width={35}
                        />
                        
                        <YAxis 
                          yAxisId="growth"
                          orientation="right"
                          tick={{ fill: '#3b82f6', fontSize: 9 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `${v}%`}
                          width={35}
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        
                        <Area
                          yAxisId="growth"
                          type="monotone"
                          dataKey="growth"
                          fill="url(#areaGrad)"
                          stroke="transparent"
                        />
                        
                        <Bar 
                          yAxisId="salary"
                          dataKey="avgSalary" 
                          name="Avg Salary"
                          fill="url(#barGrad)"
                          radius={[4, 4, 0, 0]}
                          barSize={24}
                        />
                        
                        <Line
                          yAxisId="growth"
                          type="monotone"
                          dataKey="growth"
                          name="Growth %"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, stroke: '#1e40af', r: 4 }}
                          activeDot={{ r: 6, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Career Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">Breakdown</h4>
                  {chartData.map((career, idx) => (
                    <motion.div
                      key={career.fullName}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="text-lg font-bold text-white/20">#{career.rank}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{career.fullName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-green-400">₹{career.avgSalary}L</span>
                          <span className="text-xs text-blue-400">{career.growth}% growth</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Match</div>
                        <div className="text-sm font-semibold text-white">{career.matchScore}%</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Averages Footer */}
                <div className="flex items-center justify-center gap-6 py-3 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Avg Salary</p>
                    <p className="text-sm font-semibold text-white">₹{avgSalary.toFixed(0)}L</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Avg Growth</p>
                    <p className="text-sm font-semibold text-white">{avgGrowth.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
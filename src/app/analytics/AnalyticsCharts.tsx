"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface WeeklyData {
  date: string;
  count: number;
}

interface TemplateData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  weeklyData: WeeklyData[];
  templateData: TemplateData[];
}

// Professional SaaS color palette for the Donut Chart
const COLORS = ['#3b82f6', '#ec4899', '#22c55e', '#eab308', '#a855f7', '#ef4444', '#64748b'];

export default function AnalyticsCharts({ weeklyData, templateData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Chart 1: 7-Day Activity */}
     <div className="relative group bg-white/[0.03] backdrop-blur-3xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/30">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Generations (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                allowDecimals={false} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={false}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Template Usage Distribution */}
    <div className="relative group bg-white/[0.03] backdrop-blur-3xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/30">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Template Usage</h3>
        <div className="h-[300px] w-full">
          {templateData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No template data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={templateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {templateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
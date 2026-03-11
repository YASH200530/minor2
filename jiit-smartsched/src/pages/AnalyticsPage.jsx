import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, Building2, Users, AlertTriangle } from 'lucide-react'

const analyticsData = {
  '128': {
    roomUtil: [
      { name: 'Room 301', value: 85 },
      { name: 'Lab CS-01', value: 70 },
      { name: 'Room 405', value: 90 },
      { name: 'Auditorium', value: 45 },
      { name: 'Lab EC-01', value: 65 },
      { name: 'Room 502', value: 80 },
    ],
    teacherWorkload: [
      { name: 'Dr. Rajesh', hours: 18 },
      { name: 'Prof. Sunita', hours: 15 },
      { name: 'Dr. Anil', hours: 12 },
      { name: 'Prof. Meena', hours: 10 },
      { name: 'Dr. Vikas', hours: 14 },
    ],
    clashTrends: [
      { week: 'Week 1', clashes: 28, resolved: 20 },
      { week: 'Week 2', clashes: 35, resolved: 28 },
      { week: 'Week 3', clashes: 22, resolved: 18 },
      { week: 'Week 4', clashes: 18, resolved: 14 },
    ],
    pieData: [
      { name: 'Resolved', value: 89 },
      { name: 'Pending', value: 11 },
    ],
    avgUtil: '74.2%',
    avgWorkload: '13.8 hrs',
    clashRes: '91.2%',
    efficiency: '8.9/10',
  },
  '62': {
    roomUtil: [
      { name: 'Room 301', value: 85 },
      { name: 'Lab 202', value: 70 },
      { name: 'Room 405', value: 90 },
      { name: 'Auditorium', value: 45 },
      { name: 'Lab 103', value: 65 },
      { name: 'Room 502', value: 80 },
    ],
    teacherWorkload: [
      { name: 'Dr. Sarah', hours: 19 },
      { name: 'Prof. Chen', hours: 15 },
      { name: 'Dr. Emily', hours: 11 },
      { name: 'Prof. Wilson', hours: 13 },
      { name: 'Dr. Priya', hours: 15 },
    ],
    clashTrends: [
      { week: 'Week 1', clashes: 27, resolved: 19 },
      { week: 'Week 2', clashes: 36, resolved: 28 },
      { week: 'Week 3', clashes: 21, resolved: 19 },
      { week: 'Week 4', clashes: 18, resolved: 14 },
    ],
    pieData: [
      { name: 'Resolved', value: 89 },
      { name: 'Pending', value: 11 },
    ],
    avgUtil: '72.5%',
    avgWorkload: '15 hrs',
    clashRes: '89.4%',
    efficiency: '8.7/10',
  }
}

const COLORS = ['#22c55e', '#7c3aed']

const metricCards = (d) => [
  { label: 'Avg. Room Utilization', value: d.avgUtil, sub: '+5.2% from last month', icon: Building2, subColor: 'text-green-400' },
  { label: 'Avg. Teacher Workload', value: d.avgWorkload, sub: 'Per week', icon: Users, subColor: 'text-gray-500' },
  { label: 'Clash Resolution', value: d.clashRes, sub: '+12% improvement', icon: AlertTriangle, subColor: 'text-green-400' },
  { label: 'Efficiency Score', value: d.efficiency, sub: 'Overall performance', icon: TrendingUp, subColor: 'text-gray-500' },
]

export default function AnalyticsPage({ campus }) {
  const d = analyticsData[campus]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Insights and performance metrics — Sector {campus}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards(d).map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-[#111111] border border-white/5 rounded-2xl p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs">{m.label}</span>
                <Icon size={16} className="text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
              <div className={`text-xs ${m.subColor}`}>{m.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Room Utilization</h3>
          <p className="text-gray-500 text-xs mb-5">Percentage of time rooms are occupied</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.roomUtil} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Teacher Workload</h3>
          <p className="text-gray-500 text-xs mb-5">Weekly teaching hours per faculty</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.teacherWorkload} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="hours" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col items-center">
          <div className="w-full mb-2">
            <h3 className="text-white font-semibold mb-1">Clash Resolution Status</h3>
            <p className="text-gray-500 text-xs">Distribution of resolved vs pending clashes</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={d.pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {d.pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: 13 }}>{value} {entry.payload.value}%</span>
                )}
              />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Weekly Clash Trends</h3>
          <p className="text-gray-500 text-xs mb-5">Detected and resolved clashes over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.clashTrends} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="clashes" fill="#ef4444" radius={[4, 4, 0, 0]} name="clashes" />
              <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="resolved" />
              <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

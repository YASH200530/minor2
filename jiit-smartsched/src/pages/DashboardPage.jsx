import React from 'react'
import { BookOpen, Users, Building2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

const campusData = {
  '128': {
    classes: 312, teachers: 58, rooms: 45, clashes: 3,
    activity: [
      { text: 'New timetable generated for B.Tech Sem 4', time: '2 hours ago', color: 'bg-green-500' },
      { text: 'Clash resolved in Room 301 - A Block', time: '4 hours ago', color: 'bg-purple-500' },
      { text: 'Prof. Rajesh Kumar added to CS Dept', time: '1 day ago', color: 'bg-green-500' },
      { text: 'Lab A-Block schedule updated', time: '2 days ago', color: 'bg-blue-500' },
    ]
  },
  '62': {
    classes: 248, teachers: 42, rooms: 28, clashes: 5,
    activity: [
      { text: 'New timetable generated for MCA Sem 2', time: '1 hour ago', color: 'bg-green-500' },
      { text: 'Clash resolved in Room C-201', time: '3 hours ago', color: 'bg-purple-500' },
      { text: 'Dr. Priya Singh added to IT Dept', time: '1 day ago', color: 'bg-green-500' },
      { text: 'Seminar Hall schedule updated', time: '2 days ago', color: 'bg-blue-500' },
    ]
  }
}

export default function DashboardPage({ setActivePage, campus }) {
  const data = campusData[campus]

  const stats = [
    { label: 'Total Classes', value: data.classes, icon: BookOpen, change: '+12%', up: true },
    { label: 'Total Teachers', value: data.teachers, icon: Users, change: '+3', up: true },
    { label: 'Total Rooms', value: data.rooms, icon: Building2, change: '', up: null },
    { label: 'Clashes Detected', value: data.clashes, icon: AlertTriangle, change: '-8', up: false },
  ]

  const quickActions = [
    { label: 'Generate New Timetable', icon: BookOpen, page: 'timetable' },
    { label: 'Detect Clashes', icon: AlertTriangle, page: 'clashdetection' },
    { label: 'Add Teacher', icon: Users, page: 'teachers' },
    { label: 'Add Room', icon: Building2, page: 'rooms' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">JIIT Sector {campus} Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-[#111111] border border-white/5 rounded-2xl p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                <div className="w-10 h-10 bg-[#1e1a3a] rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-purple-400" />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{stat.value}</span>
                {stat.change && (
                  <span className={`flex items-center gap-1 text-sm mb-1 ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {data.activity.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{item.text}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-5">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => setActivePage(action.page)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all text-left group"
                >
                  <Icon size={18} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

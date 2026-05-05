import React, { useState } from 'react'
import {
  LayoutDashboard, Users, Building2, BookOpen, AlertTriangle,
  Calendar, BarChart3, Bell, Settings, ChevronLeft, X
} from 'lucide-react'
import DashboardPage from './DashboardPage'
import TeachersPage from './TeachersPage'
import RoomsPage from './RoomsPage'
import SubjectsPage from './SubjectsPage'
import ClashDetectionPage from './ClashDetectionPage'
import TimetablePage from './TimetablePage'
import AnalyticsPage from './AnalyticsPage'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'teachers', label: 'Teachers', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: Building2 },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'clashdetection', label: 'Clash Detection', icon: AlertTriangle },
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const pageTitles = {
  dashboard: 'Dashboard',
  teachers: 'Teachers',
  rooms: 'Rooms',
  subjects: 'Subjects',
  clashdetection: 'Clash Detection',
  timetable: 'Timetable',
  analytics: 'Analytics',
}

export default function Dashboard({ onBack }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [campus, setCampus] = useState('128') // '128' or '62'

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} campus={campus} />
      case 'teachers': return <TeachersPage campus={campus} />
      case 'rooms': return <RoomsPage campus={campus} />
      case 'subjects': return <SubjectsPage campus={campus} />
      case 'clashdetection': return <ClashDetectionPage campus={campus} />
      case 'timetable': return <TimetablePage campus={campus} />
      case 'analytics': return <AnalyticsPage campus={campus} />
      default: return <DashboardPage setActivePage={setActivePage} campus={campus} />
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 min-w-[256px] bg-[#0d0d0d] border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1e1a3a] border border-purple-700/40 rounded-lg flex items-center justify-center">
              <Calendar size={18} className="text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">JIIT SmartSched</div>
              <div className="text-[11px] text-gray-500">Timetable Manager</div>
            </div>
          </div>
        </div>

        {/* Campus Toggle */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Campus</div>
          <div className="flex rounded-lg bg-[#111] border border-white/5 overflow-hidden text-xs">
            <button
              onClick={() => setCampus('128')}
              className={`flex-1 py-1.5 font-medium transition-colors ${campus === '128' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sec 128
            </button>
            <button
              onClick={() => setCampus('62')}
              className={`flex-1 py-1.5 font-medium transition-colors ${campus === '62' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sec 62
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage === id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom user */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <div className="text-sm text-white font-medium">Admin User</div>
              <div className="text-xs text-gray-500">JIIT Sec {campus}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d0d0d]">
          <div className="flex items-center gap-3">

            <h1 className="text-lg font-semibold text-white">{pageTitles[activePage]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </button>
            <button className="text-gray-500 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

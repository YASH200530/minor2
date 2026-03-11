import React from 'react'
import { Sparkles, Calendar, AlertTriangle, Users, Building2, BarChart3, GripVertical, Mail, Phone, MapPin, Star } from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Clash Detection',
    desc: 'Automatically detect scheduling conflicts and overlapping classes in real-time',
    highlighted: false,
  },
  {
    icon: Sparkles,
    title: 'Auto Rescheduling',
    desc: 'AI-powered smart suggestions to resolve clashes instantly with optimal solutions',
    highlighted: true,
  },
  {
    icon: Users,
    title: 'Teacher Preferences',
    desc: 'Respect faculty availability and preferred time slots for better work-life balance',
    highlighted: false,
  },
  {
    icon: Building2,
    title: 'Room Optimization',
    desc: 'Maximize space utilization with intelligent room allocation algorithms',
    highlighted: false,
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Visual insights into resource utilization, workload distribution, and efficiency',
    highlighted: false,
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Editor',
    desc: 'Intuitive interface to manually adjust schedules with real-time conflict warnings',
    highlighted: false,
  },
]

const stats = [
  { label: 'Faculty Members', value: '450+' },
  { label: 'Classrooms', value: '120+' },
  { label: 'Subjects Managed', value: '800+' },
  { label: 'Clashes Resolved', value: '99%' },
]

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1e1a3a] border border-purple-700/40 rounded-lg flex items-center justify-center">
            <Calendar size={18} className="text-purple-400" />
          </div>
          <div>
            <span className="font-bold text-white text-base">JIIT SmartSched AI</span>
            <span className="block text-[10px] text-gray-500 leading-none">Sector 128 & 62</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 hero-gradient overflow-hidden pt-16">
        {/* Background diagonal lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
            style={{
              background: 'conic-gradient(from 200deg at 80% 40%, transparent 60deg, rgba(109,40,217,0.4) 120deg, transparent 180deg)',
            }}
          />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] opacity-10"
            style={{
              background: 'conic-gradient(from 160deg at 70% 70%, transparent 40deg, rgba(139,92,246,0.5) 100deg, transparent 160deg)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1e1a3a]/80 border border-purple-700/40 text-purple-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <Sparkles size={14} />
            <span>AI-Powered Scheduling</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            JIIT SmartSched AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
            AI-powered timetable clash detection and optimization for
            <br />
            <span className="text-purple-400 font-medium">Jaypee Institute of Information Technology</span>
          </p>
          <p className="text-sm text-gray-600 mb-10">Sector 128, Noida &nbsp;•&nbsp; Sector 62, Noida</p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-purple-900/40"
          >
            Get Started →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0d0d0d] border-y border-white/5 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to manage JIIT timetables efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border card-hover bg-[#111111] border-white/5"
                >
                  <div className="w-12 h-12 bg-[#1e1a3a] rounded-xl flex items-center justify-center mb-5">
                    <Icon size={22} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Campus Info */}
      <section id="about" className="py-24 px-8 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Campuses</h2>
            <p className="text-gray-400 text-lg">Serving both JIIT campuses with unified scheduling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                sector: 'Sector 128',
                location: 'A-10, Sector 128, Noida, UP 201304',
                departments: ['Computer Science & Engineering', 'Electronics & Communication', 'Biotechnology', 'Humanities & Social Sciences'],
                color: 'border-purple-600/50',
                badge: 'bg-purple-900/40 text-purple-300',
              },
              {
                sector: 'Sector 62',
                location: 'H-165, Sector 63, Noida, UP 201307',
                departments: ['Information Technology', 'Computer Science', 'Electronics', 'Mathematics & Computing'],
                color: 'border-blue-600/30',
                badge: 'bg-blue-900/30 text-blue-300',
              },
            ].map((campus) => (
              <div key={campus.sector} className={`p-8 bg-[#111111] rounded-2xl border ${campus.color} card-hover`}>
                <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${campus.badge}`}>
                  {campus.sector}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">JIIT {campus.sector}</h3>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                  <MapPin size={14} />
                  {campus.location}
                </p>
                <div className="space-y-2">
                  {campus.departments.map((dept) => (
                    <div key={dept} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      {dept}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0a0a0a] border-t border-white/5 py-16 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#1e1a3a] border border-purple-700/40 rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-purple-400" />
              </div>
              <span className="font-bold text-white">JIIT SmartSched AI</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Intelligent timetable management for JIIT — Sector 128 & Sector 62, Noida.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-gray-600" />
                <span>support@jiit.ac.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-gray-600" />
                <span>+91 120 234-3000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-gray-600" />
                <span>Sector 128 & Sector 62, Noida, UP</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="block hover:text-white transition-colors">Documentation</a>
              <a href="#" className="block hover:text-white transition-colors">API Reference</a>
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-sm">© 2024 JIIT SmartSched AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

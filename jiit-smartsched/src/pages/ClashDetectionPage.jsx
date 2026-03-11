import React, { useState } from 'react'
import { Upload, Download, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react'

const sampleClashes = {
  '128': [
    { id: 1, type: 'Room Conflict', desc: 'Room 301 double-booked', subjects: 'CS101 & EC201', time: 'Mon 9:00 AM', status: 'pending' },
    { id: 2, type: 'Teacher Conflict', desc: 'Prof. Rajesh Kumar in two classes', subjects: 'CS202 & CS301', time: 'Tue 10:00 AM', status: 'pending' },
    { id: 3, type: 'Room Conflict', desc: 'Lab CS-01 scheduling overlap', subjects: 'CS101 Lab & CS202 Lab', time: 'Wed 2:00 PM', status: 'resolved' },
  ],
  '62': [
    { id: 1, type: 'Room Conflict', desc: 'Room 301 double-booked', subjects: 'CS101 & PH101', time: 'Mon 9:00 AM', status: 'pending' },
    { id: 2, type: 'Teacher Conflict', desc: 'Dr. Sarah Johnson in two classes', subjects: 'CS202 & CS101', time: 'Thu 10:00 AM', status: 'pending' },
    { id: 3, type: 'Room Conflict', desc: 'Lab 202 scheduling overlap', subjects: 'CS Lab & IT Lab', time: 'Fri 2:00 PM', status: 'pending' },
    { id: 4, type: 'Teacher Conflict', desc: 'Prof. Michael Chen overloaded', subjects: 'MA201 & MA301', time: 'Wed 11:00 AM', status: 'resolved' },
    { id: 5, type: 'Room Conflict', desc: 'Auditorium overlap detected', subjects: 'Seminar & Event', time: 'Sat 9:00 AM', status: 'resolved' },
  ]
}

export default function ClashDetectionPage({ campus }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [clashes, setClashes] = useState([])

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setClashes(sampleClashes[campus])
      setAnalyzing(false)
      setAnalyzed(true)
    }, 2000)
  }

  const resolveClash = (id) => {
    setClashes(clashes.map(c => c.id === id ? { ...c, status: 'resolved' } : c))
  }

  const pending = clashes.filter(c => c.status === 'pending')
  const resolved = clashes.filter(c => c.status === 'resolved')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Clash Detection</h2>
        <p className="text-gray-500 text-sm mt-1">Upload and analyze timetables for conflicts — Sector {campus}</p>
      </div>

      {!analyzed ? (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#1e1a3a] border border-purple-700/30 rounded-2xl flex items-center justify-center mb-6">
            {analyzing ? (
              <RefreshCw size={36} className="text-purple-400 animate-spin" />
            ) : (
              <Upload size={36} className="text-purple-400" />
            )}
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            {analyzing ? 'Analyzing Timetable...' : 'Upload Timetable'}
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            {analyzing ? 'AI is scanning for scheduling conflicts' : 'Upload your CSV or Excel file to detect clashes'}
          </p>
          {!analyzing && (
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
              >
                <Upload size={16} />
                Upload & Analyze
              </button>
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors">
                <Download size={16} />
                Export Report
              </button>
            </div>
          )}
          {analyzing && (
            <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-white mb-1">{clashes.length}</div>
              <div className="text-gray-500 text-sm">Total Clashes</div>
            </div>
            <div className="bg-[#111111] border border-red-500/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{pending.length}</div>
              <div className="text-gray-500 text-sm">Pending</div>
            </div>
            <div className="bg-[#111111] border border-green-500/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{resolved.length}</div>
              <div className="text-gray-500 text-sm">Resolved</div>
            </div>
          </div>

          {/* Clashes List */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-white font-semibold">Detected Clashes</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAnalyzed(false); setClashes([]) }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-xs border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Upload size={12} />
                  Re-analyze
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xs border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
                  <Download size={12} />
                  Export
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {clashes.map((clash) => (
                <div key={clash.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      clash.status === 'resolved' ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}>
                      {clash.status === 'resolved'
                        ? <CheckCircle size={18} className="text-green-400" />
                        : <AlertTriangle size={18} className="text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-medium">{clash.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          clash.status === 'resolved'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {clash.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{clash.desc} — {clash.subjects}</p>
                      <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} />{clash.time}
                      </p>
                    </div>
                  </div>
                  {clash.status === 'pending' && (
                    <button
                      onClick={() => resolveClash(clash.id)}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      Auto-Resolve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Download } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

const initialSchedule128 = {
  'Monday-9:00 AM':   { code: 'CS101', teacher: 'Prof. Rajesh', room: '301', color: 'bg-purple-700/80 border-purple-500/50' },
  'Monday-11:00 AM':  { code: 'MA201', teacher: 'Prof. Sunita', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Tuesday-10:00 AM': { code: 'CH301', teacher: 'Dr. Vikas', room: '502', color: 'bg-yellow-700/80 border-yellow-500/50' },
  'Wednesday-9:00 AM':{ code: 'MA201', teacher: 'Prof. Sunita', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Thursday-10:00 AM':{ code: 'CS202', teacher: 'Prof. Rajesh', room: '301', color: 'bg-purple-700/80 border-purple-500/50' },
  'Friday-9:00 AM':   { code: 'EE101', teacher: 'Dr. Anil', room: 'Lab 103', color: 'bg-red-700/80 border-red-500/50' },
  'Friday-11:00 AM':  { code: 'MA201', teacher: 'Prof. Sunita', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Saturday-10:00 AM':{ code: 'PH101', teacher: 'Prof. Meena', room: 'Lab 202', color: 'bg-green-700/80 border-green-500/50' },
  'Wednesday-12:00 PM':{ code: 'PH101', teacher: 'Prof. Meena', room: 'Lab 202', color: 'bg-green-700/80 border-green-500/50' },
}

const initialSchedule62 = {
  'Monday-9:00 AM':   { code: 'CS101', teacher: 'Dr. Sarah', room: '301', color: 'bg-purple-700/80 border-purple-500/50' },
  'Monday-11:00 AM':  { code: 'MA201', teacher: 'Prof. Chen', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Tuesday-10:00 AM': { code: 'CH301', teacher: 'Prof. Wilson', room: '502', color: 'bg-yellow-700/80 border-yellow-500/50' },
  'Wednesday-9:00 AM':{ code: 'MA201', teacher: 'Prof. Chen', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Thursday-10:00 AM':{ code: 'CS202', teacher: 'Dr. Sarah', room: '301', color: 'bg-purple-700/80 border-purple-500/50' },
  'Friday-9:00 AM':   { code: 'EE101', teacher: 'Dr. Kumar', room: 'Lab 103', color: 'bg-red-700/80 border-red-500/50' },
  'Friday-11:00 AM':  { code: 'MA201', teacher: 'Prof. Chen', room: '405', color: 'bg-blue-700/80 border-blue-500/50' },
  'Saturday-10:00 AM':{ code: 'PH101', teacher: 'Dr. Emily', room: 'Lab 202', color: 'bg-green-700/80 border-green-500/50' },
  'Wednesday-12:00 PM':{ code: 'PH101', teacher: 'Dr. Emily', room: 'Lab 202', color: 'bg-green-700/80 border-green-500/50' },
}

const legend = [
  { label: 'Computer Science', color: 'bg-purple-600' },
  { label: 'Mathematics', color: 'bg-blue-600' },
  { label: 'Physics', color: 'bg-green-600' },
  { label: 'Chemistry', color: 'bg-yellow-600' },
  { label: 'Electrical Eng.', color: 'bg-red-600' },
]

export default function TimetablePage({ campus }) {
  const initialSchedule = campus === '128' ? initialSchedule128 : initialSchedule62
  const [schedule, setSchedule] = useState(initialSchedule)
  const [dragging, setDragging] = useState(null)

  const handleDragStart = (key, item) => setDragging({ key, item })

  const handleDrop = (targetKey) => {
    if (!dragging || dragging.key === targetKey) return
    const newSchedule = { ...schedule }
    delete newSchedule[dragging.key]
    newSchedule[targetKey] = dragging.item
    setSchedule(newSchedule)
    setDragging(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Timetable View</h2>
          <p className="text-gray-500 text-sm mt-1">Drag and drop classes to reschedule — Sector {campus}</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-500 text-sm font-medium w-28">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 text-white text-sm font-semibold bg-[#1a1435]/60 border-l border-white/5">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-gray-500 text-sm whitespace-nowrap">{time}</td>
                  {days.map(day => {
                    const key = `${day}-${time}`
                    const cell = schedule[key]
                    return (
                      <td
                        key={day}
                        className="p-2 border-l border-white/5 h-16 align-top"
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(key)}
                      >
                        {cell && (
                          <div
                            draggable
                            onDragStart={() => handleDragStart(key, cell)}
                            className={`drag-item h-full rounded-xl border p-2 cursor-grab ${cell.color} select-none`}
                          >
                            <div className="text-white text-xs font-bold">{cell.code}</div>
                            <div className="text-white/70 text-[10px]">{cell.teacher}</div>
                            <div className="text-white/50 text-[10px]">{cell.room}</div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4">
        <div className="text-sm text-gray-400 font-medium mb-3">Subject Legend</div>
        <div className="flex flex-wrap gap-5">
          {legend.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
              <div className={`w-3 h-3 ${color} rounded-sm`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

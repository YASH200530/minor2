import React, { useState } from 'react'
import { Search, Plus, Edit2, Trash2, MapPin, Users, X } from 'lucide-react'

const roomsByCampus = {
  '128': [
    { id: 1, name: 'Room 301', type: 'Lecture Hall', block: 'A-Block', capacity: 60, utilization: 85 },
    { id: 2, name: 'Lab CS-01', type: 'Computer Lab', block: 'B-Block', capacity: 40, utilization: 70 },
    { id: 3, name: 'Room 405', type: 'Classroom', block: 'A-Block', capacity: 50, utilization: 90 },
    { id: 4, name: 'Auditorium', type: 'Auditorium', block: 'Main Block', capacity: 500, utilization: 45 },
    { id: 5, name: 'Lab EC-01', type: 'Electronics Lab', block: 'C-Block', capacity: 35, utilization: 65 },
    { id: 6, name: 'Room 502', type: 'Classroom', block: 'B-Block', capacity: 55, utilization: 80 },
    { id: 7, name: 'Seminar Hall 1', type: 'Seminar Hall', block: 'A-Block', capacity: 100, utilization: 55 },
    { id: 8, name: 'Lab Bio-01', type: 'Biology Lab', block: 'D-Block', capacity: 30, utilization: 40 },
  ],
  '62': [
    { id: 1, name: 'Room 301', type: 'Lecture Hall', block: 'A-Block', capacity: 60, utilization: 85 },
    { id: 2, name: 'Lab 202', type: 'Computer Lab', block: 'B-Block', capacity: 40, utilization: 70 },
    { id: 3, name: 'Room 405', type: 'Classroom', block: 'A-Block', capacity: 50, utilization: 90 },
    { id: 4, name: 'Auditorium', type: 'Auditorium', block: 'Main Block', capacity: 200, utilization: 45 },
    { id: 5, name: 'Lab 103', type: 'Physics Lab', block: 'C-Block', capacity: 35, utilization: 65 },
    { id: 6, name: 'Room 502', type: 'Classroom', block: 'B-Block', capacity: 55, utilization: 80 },
  ]
}

function UtilizationBar({ value }) {
  const color = value >= 85 ? 'bg-red-500' : value >= 65 ? 'bg-purple-500' : 'bg-purple-600'
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Utilization</span>
        <span className={value >= 85 ? 'text-red-400' : 'text-purple-400'}>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function RoomsPage({ campus }) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [rooms, setRooms] = useState(roomsByCampus[campus])
  const [form, setForm] = useState({ name: '', type: '', block: '', capacity: '' })

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.block.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.name) return
    setRooms([...rooms, { id: Date.now(), ...form, capacity: parseInt(form.capacity) || 0, utilization: 0 }])
    setForm({ name: '', type: '', block: '', capacity: '' })
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Rooms Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage classroom and lab spaces — Sector {campus}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search rooms by name, block, or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((room) => (
          <div key={room.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{room.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{room.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                <button
                  onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{room.block}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users size={12} />
                <span>Capacity: {room.capacity}</span>
              </div>
            </div>

            <UtilizationBar value={room.utilization} />
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Room</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'name', placeholder: 'Room Name', label: 'Name' },
                { key: 'type', placeholder: 'Room Type (e.g. Classroom)', label: 'Type' },
                { key: 'block', placeholder: 'Block (e.g. A-Block)', label: 'Block' },
                { key: 'capacity', placeholder: 'Seating Capacity', label: 'Capacity' },
              ].map(({ key, placeholder, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/50"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">Add Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

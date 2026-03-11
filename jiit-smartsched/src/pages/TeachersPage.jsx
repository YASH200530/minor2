import React, { useState } from 'react'
import { Search, Plus, Edit2, Trash2, Mail, Phone, X } from 'lucide-react'

const teachersByCampus = {
  '128': [
    { id: 1, name: 'Dr. Rajesh Kumar', dept: 'Computer Science', email: 'rajesh.k@jiit.ac.in', phone: '+91 98765-43201', classes: 14, initials: 'RK' },
    { id: 2, name: 'Prof. Sunita Sharma', dept: 'Mathematics', email: 'sunita.s@jiit.ac.in', phone: '+91 98765-43202', classes: 12, initials: 'SS' },
    { id: 3, name: 'Dr. Anil Verma', dept: 'Electronics', email: 'anil.v@jiit.ac.in', phone: '+91 98765-43203', classes: 10, initials: 'AV' },
    { id: 4, name: 'Prof. Meena Gupta', dept: 'Physics', email: 'meena.g@jiit.ac.in', phone: '+91 98765-43204', classes: 8, initials: 'MG' },
    { id: 5, name: 'Dr. Vikas Singh', dept: 'Chemistry', email: 'vikas.s@jiit.ac.in', phone: '+91 98765-43205', classes: 11, initials: 'VS' },
    { id: 6, name: 'Prof. Kavita Joshi', dept: 'Biotechnology', email: 'kavita.j@jiit.ac.in', phone: '+91 98765-43206', classes: 9, initials: 'KJ' },
  ],
  '62': [
    { id: 1, name: 'Dr. Sarah Johnson', dept: 'Computer Science', email: 'sarah.j@jiit.ac.in', phone: '+91 234-567-8901', classes: 12, initials: 'SJ' },
    { id: 2, name: 'Prof. Michael Chen', dept: 'Mathematics', email: 'michael.c@jiit.ac.in', phone: '+91 234-567-8902', classes: 10, initials: 'MC' },
    { id: 3, name: 'Dr. Emily Rodriguez', dept: 'Physics', email: 'emily.r@jiit.ac.in', phone: '+91 234-567-8903', classes: 8, initials: 'ER' },
    { id: 4, name: 'Prof. James Wilson', dept: 'Chemistry', email: 'james.w@jiit.ac.in', phone: '+91 234-567-8904', classes: 9, initials: 'JW' },
    { id: 5, name: 'Dr. Priya Singh', dept: 'Information Technology', email: 'priya.s@jiit.ac.in', phone: '+91 234-567-8905', classes: 11, initials: 'PS' },
    { id: 6, name: 'Prof. Amit Sharma', dept: 'Electrical Eng.', email: 'amit.s@jiit.ac.in', phone: '+91 234-567-8906', classes: 7, initials: 'AS' },
  ]
}

const deptColors = {
  'Computer Science': 'bg-purple-900/40 text-purple-300',
  'Mathematics': 'bg-blue-900/40 text-blue-300',
  'Electronics': 'bg-yellow-900/30 text-yellow-300',
  'Physics': 'bg-green-900/40 text-green-300',
  'Chemistry': 'bg-orange-900/30 text-orange-300',
  'Biotechnology': 'bg-pink-900/30 text-pink-300',
  'Information Technology': 'bg-purple-900/40 text-purple-300',
  'Electrical Eng.': 'bg-red-900/30 text-red-300',
}

export default function TeachersPage({ campus }) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [teachers, setTeachers] = useState(teachersByCampus[campus])
  const [form, setForm] = useState({ name: '', dept: '', email: '', phone: '' })

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.dept.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.name) return
    setTeachers([...teachers, {
      id: Date.now(),
      ...form,
      classes: 0,
      initials: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }])
    setForm({ name: '', dept: '', email: '', phone: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => setTeachers(teachers.filter(t => t.id !== id))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Teachers Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage faculty and their schedules — Sector {campus}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search teachers by name or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/50"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((teacher) => (
          <div key={teacher.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-purple-900 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {teacher.initials}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{teacher.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${deptColors[teacher.dept] || 'bg-gray-800 text-gray-400'}`}>
                  {teacher.dept}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={12} />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={12} />
                <span>{teacher.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-gray-400 text-sm">{teacher.classes} Classes</span>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Teacher</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'name', placeholder: 'Full Name', label: 'Name' },
                { key: 'dept', placeholder: 'Department', label: 'Department' },
                { key: 'email', placeholder: 'Email Address', label: 'Email' },
                { key: 'phone', placeholder: 'Phone Number', label: 'Phone' },
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
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Search, Plus, Edit2, Trash2, BookOpen, Clock, X } from 'lucide-react'

const subjectsByCampus = {
  '128': [
    { id: 1, code: 'CS101', name: 'Data Structures', dept: 'Computer Science', credits: 4, hours: 6 },
    { id: 2, code: 'MA201', name: 'Calculus II', dept: 'Mathematics', credits: 3, hours: 4 },
    { id: 3, code: 'PH101', name: 'Engineering Physics', dept: 'Physics', credits: 4, hours: 5 },
    { id: 4, code: 'CH301', name: 'Organic Chemistry', dept: 'Chemistry', credits: 4, hours: 6 },
    { id: 5, code: 'CS202', name: 'Operating Systems', dept: 'Computer Science', credits: 3, hours: 4 },
    { id: 6, code: 'EE101', name: 'Circuit Theory', dept: 'Electrical Eng.', credits: 4, hours: 5 },
    { id: 7, code: 'CS301', name: 'Database Systems', dept: 'Computer Science', credits: 3, hours: 4 },
    { id: 8, code: 'EC201', name: 'Digital Electronics', dept: 'Electronics', credits: 4, hours: 5 },
    { id: 9, code: 'BT101', name: 'Molecular Biology', dept: 'Biotechnology', credits: 3, hours: 4 },
  ],
  '62': [
    { id: 1, code: 'CS101', name: 'Data Structures', dept: 'Computer Science', credits: 4, hours: 6 },
    { id: 2, code: 'MA201', name: 'Calculus II', dept: 'Mathematics', credits: 3, hours: 4 },
    { id: 3, code: 'PH101', name: 'Quantum Physics', dept: 'Physics', credits: 4, hours: 5 },
    { id: 4, code: 'CH301', name: 'Organic Chemistry', dept: 'Chemistry', credits: 4, hours: 6 },
    { id: 5, code: 'CS202', name: 'Operating Systems', dept: 'Computer Science', credits: 3, hours: 4 },
    { id: 6, code: 'EE101', name: 'Circuit Theory', dept: 'Electrical Eng.', credits: 4, hours: 5 },
  ]
}

const deptColors = {
  'Computer Science': 'text-purple-400',
  'Mathematics': 'text-blue-400',
  'Physics': 'text-green-400',
  'Chemistry': 'text-yellow-400',
  'Electrical Eng.': 'text-red-400',
  'Electronics': 'text-orange-400',
  'Biotechnology': 'text-pink-400',
}

export default function SubjectsPage({ campus }) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [subjects, setSubjects] = useState(subjectsByCampus[campus])
  const [form, setForm] = useState({ code: '', name: '', dept: '', credits: '', hours: '' })

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.name) return
    setSubjects([...subjects, { id: Date.now(), ...form, credits: parseInt(form.credits) || 0, hours: parseInt(form.hours) || 0 }])
    setForm({ code: '', name: '', dept: '', credits: '', hours: '' })
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Subjects Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage courses and their schedules — Sector {campus}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Subject
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search subjects by code, name, or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((subject) => (
          <div key={subject.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`text-xs font-semibold ${deptColors[subject.dept] || 'text-gray-400'}`}>{subject.code}</span>
                <h3 className="text-white font-bold text-base mt-0.5">{subject.name}</h3>
                <p className="text-gray-500 text-xs">{subject.dept}</p>
              </div>
              <div className="w-10 h-10 bg-[#1e1a3a] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-purple-400" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Credits</span>
                <span className="text-white font-medium">{subject.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> Hours/Week</span>
                <span className="text-white font-medium">{subject.hours}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
              <button className="text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
              <button
                onClick={() => setSubjects(subjects.filter(s => s.id !== subject.id))}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Subject</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'code', placeholder: 'Subject Code (e.g. CS101)', label: 'Code' },
                { key: 'name', placeholder: 'Subject Name', label: 'Name' },
                { key: 'dept', placeholder: 'Department', label: 'Department' },
                { key: 'credits', placeholder: 'Credits', label: 'Credits' },
                { key: 'hours', placeholder: 'Hours per Week', label: 'Hours/Week' },
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
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

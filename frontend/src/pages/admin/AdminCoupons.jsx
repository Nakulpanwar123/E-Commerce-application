import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiX, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'

const INITIAL = [
  { id: 1, code: 'FUTURE10', type: 'percentage', value: 10, min_order: 500,  used: 142, limit: 500,  expires: '2025-03-31', active: true },
  { id: 2, code: 'SAVE20',   type: 'percentage', value: 20, min_order: 1000, used: 89,  limit: 200,  expires: '2025-01-31', active: true },
  { id: 3, code: 'FLAT200',  type: 'fixed',      value: 200,min_order: 800,  used: 56,  limit: 100,  expires: '2024-12-31', active: false },
  { id: 4, code: 'FIRST15',  type: 'percentage', value: 15, min_order: 0,    used: 234, limit: 1000, expires: '2025-06-30', active: true },
]

export default function AdminCoupons() {
  const [coupons, setCoupons]     = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ code: '', type: 'percentage', value: '', min_order: '', limit: '', expires: '' })

  const handleDelete = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
    toast.success('Coupon deleted', { style: { background: '#12121f', color: '#fff' } })
  }

  const handleToggle = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const handleAdd = () => {
    if (!form.code || !form.value) { toast.error('Code and value required'); return }
    setCoupons(prev => [...prev, { id: Date.now(), code: form.code.toUpperCase(), type: form.type, value: Number(form.value), min_order: Number(form.min_order) || 0, used: 0, limit: Number(form.limit) || 999, expires: form.expires || '2025-12-31', active: true }])
    toast.success('Coupon created!', { style: { background: '#12121f', color: '#fff' } })
    setShowModal(false)
    setForm({ code: '', type: 'percentage', value: '', min_order: '', limit: '', expires: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600 font-mono">{coupons.length} coupons</p>
        <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
          <span className="flex items-center gap-1.5"><FiPlus size={13} /> New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {coupons.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-card p-4 relative border transition-all duration-300 ${c.active ? 'border-neon-cyan/20' : 'border-white/5 opacity-60'}`}>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiTag size={14} className="text-neon-cyan" />
                <span className="font-mono font-bold text-neon-cyan text-base tracking-widest">{c.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(c.id)}
                  className={`px-2 py-0.5 text-[10px] font-mono border transition-all ${c.active ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-gray-600 hover:text-neon-pink transition-colors">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-gray-600 font-mono">Discount</p><p className="text-white font-bold">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</p></div>
              <div><p className="text-gray-600 font-mono">Min Order</p><p className="text-white">₹{c.min_order}</p></div>
              <div><p className="text-gray-600 font-mono">Used / Limit</p><p className="text-white">{c.used} / {c.limit}</p></div>
              <div><p className="text-gray-600 font-mono">Expires</p><p className="text-white">{c.expires}</p></div>
            </div>
            {/* Usage bar */}
            <div className="mt-3">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((c.used / c.limit) * 100, 100)}%`, background: 'linear-gradient(90deg,#00f5ff,#bf00ff)' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg text-white">Create Coupon</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><FiX size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'code',      label: 'Coupon Code *', col: 2, placeholder: 'SAVE20' },
                  { key: 'value',     label: 'Discount Value *', placeholder: '10' },
                  { key: 'min_order', label: 'Min Order (₹)',    placeholder: '500' },
                  { key: 'limit',     label: 'Usage Limit',      placeholder: '100' },
                  { key: 'expires',   label: 'Expiry Date',      placeholder: '2025-12-31', col: 2 },
                ].map(({ key, label, col, placeholder }) => (
                  <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="input py-2 text-sm" placeholder={placeholder} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input py-2 text-sm">
                    <option value="percentage" className="bg-surface-card">Percentage (%)</option>
                    <option value="fixed" className="bg-surface-card">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                <button onClick={handleAdd} className="btn-primary flex-1 py-2"><span>Create Coupon</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

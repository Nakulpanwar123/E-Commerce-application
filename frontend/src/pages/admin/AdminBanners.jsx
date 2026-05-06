import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiX, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const INITIAL = [
  { id: 1, title: 'New Season Arrivals', subtitle: 'Up to 50% off', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=100&fit=crop', position: 'hero', active: true, link: '/category/women' },
  { id: 2, title: "Men's Collection",    subtitle: 'Explore trends',  image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=100&fit=crop', position: 'hero', active: true, link: '/category/men' },
  { id: 3, title: 'Sale — Up to 40%',   subtitle: 'Limited time',    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=100&fit=crop', position: 'mid',  active: false, link: '/sale' },
]

export default function AdminBanners() {
  const [banners, setBanners]     = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ title: '', subtitle: '', image: '', link: '', position: 'hero' })

  const handleDelete = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id))
    toast.success('Banner deleted', { style: { background: '#12121f', color: '#fff' } })
  }

  const handleToggle = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  const handleAdd = () => {
    if (!form.title || !form.image) { toast.error('Title and image URL required'); return }
    setBanners(prev => [...prev, { id: Date.now(), ...form, active: true }])
    toast.success('Banner added!', { style: { background: '#12121f', color: '#fff' } })
    setShowModal(false)
    setForm({ title: '', subtitle: '', image: '', link: '', position: 'hero' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600 font-mono">{banners.length} banners</p>
        <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
          <span className="flex items-center gap-1.5"><FiPlus size={13} /> Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b, i) => (
          <motion.div key={b.id}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`glass-card overflow-hidden relative transition-all duration-300 ${b.active ? 'border-neon-cyan/20' : 'opacity-50'}`}>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan z-10" />
            <div className="relative h-28 overflow-hidden">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-4">
                <div>
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  <p className="text-gray-300 text-xs">{b.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-[10px] font-mono border capitalize ${b.position === 'hero' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20'}`}>
                  {b.position}
                </span>
                <button onClick={() => handleToggle(b.id)}
                  className={`px-2 py-0.5 text-[10px] font-mono border transition-all ${b.active ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                  {b.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <a href={b.link} target="_blank" rel="noreferrer" className="p-1.5 text-gray-600 hover:text-neon-cyan transition-colors"><FiEye size={13} /></a>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-gray-600 hover:text-neon-pink transition-colors"><FiTrash2 size={13} /></button>
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
                <h2 className="font-display text-lg text-white">Add Banner</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><FiX size={18} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'title',    label: 'Title *',     placeholder: 'New Season Arrivals' },
                  { key: 'subtitle', label: 'Subtitle',    placeholder: 'Up to 50% off' },
                  { key: 'image',    label: 'Image URL *', placeholder: 'https://...' },
                  { key: 'link',     label: 'Link URL',    placeholder: '/category/women' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="input py-2 text-sm" placeholder={placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Position</label>
                  <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="input py-2 text-sm">
                    <option value="hero" className="bg-surface-card">Hero (Main)</option>
                    <option value="mid" className="bg-surface-card">Mid Page</option>
                    <option value="sidebar" className="bg-surface-card">Sidebar</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                <button onClick={handleAdd} className="btn-primary flex-1 py-2"><span>Add Banner</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

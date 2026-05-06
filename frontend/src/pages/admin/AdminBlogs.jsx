import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const INITIAL_BLOGS = [
  { id: 1, title: 'The Future of Fashion: AI-Designed Clothing', slug: 'future-of-fashion-ai', status: 'published', author: 'Admin', date: '2024-11-01', views: 1240, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=40&fit=crop' },
  { id: 2, title: 'Sustainable Fashion: Dressing for Tomorrow',  slug: 'sustainable-fashion',  status: 'published', author: 'Admin', date: '2024-10-20', views: 890,  thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=60&h=40&fit=crop' },
  { id: 3, title: 'Cyberpunk Aesthetics in Everyday Wear',       slug: 'cyberpunk-fashion',    status: 'draft',     author: 'Admin', date: '2024-10-10', views: 0,    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=60&h=40&fit=crop' },
]

export default function AdminBlogs() {
  const [blogs, setBlogs]         = useState(INITIAL_BLOGS)
  const [showModal, setShowModal] = useState(false)
  const [editBlog, setEditBlog]   = useState(null)
  const [form, setForm]           = useState({ title: '', excerpt: '', content: '', tags: '', status: 'draft' })

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id))
    toast.success('Blog deleted', { style: { background: '#12121f', color: '#fff' } })
  }

  const handleToggleStatus = (id) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published' } : b))
    toast.success('Status updated', { style: { background: '#12121f', color: '#fff' } })
  }

  const openAdd = () => { setEditBlog(null); setForm({ title: '', excerpt: '', content: '', tags: '', status: 'draft' }); setShowModal(true) }
  const openEdit = (b) => { setEditBlog(b); setForm({ title: b.title, excerpt: '', content: '', tags: '', status: b.status }); setShowModal(true) }

  const handleSave = () => {
    if (!form.title) { toast.error('Title required'); return }
    if (editBlog) {
      setBlogs(prev => prev.map(b => b.id === editBlog.id ? { ...b, title: form.title, status: form.status } : b))
      toast.success('Blog updated!', { style: { background: '#12121f', color: '#fff' } })
    } else {
      setBlogs(prev => [...prev, { id: Date.now(), title: form.title, slug: form.title.toLowerCase().replace(/\s+/g, '-'), status: form.status, author: 'Admin', date: new Date().toLocaleDateString(), views: 0, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=40&fit=crop' }])
      toast.success('Blog created!', { style: { background: '#12121f', color: '#fff' } })
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600 font-mono">{blogs.length} blog posts</p>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
          <span className="flex items-center gap-1.5"><FiPlus size={13} /> New Post</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {['Post', 'Status', 'Author', 'Views', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-gray-600 font-mono uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <motion.tr key={blog.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/3 hover:bg-white/2 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={blog.thumbnail} alt="" className="w-12 h-8 object-cover bg-surface-card flex-shrink-0" />
                    <p className="text-gray-200 font-medium line-clamp-1 max-w-[200px] group-hover:text-neon-cyan transition-colors">{blog.title}</p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => handleToggleStatus(blog.id)}
                    className={`px-2 py-0.5 text-[10px] font-mono border capitalize transition-all
                      ${blog.status === 'published' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    {blog.status}
                  </button>
                </td>
                <td className="px-5 py-3 text-gray-500">{blog.author}</td>
                <td className="px-5 py-3 font-mono text-gray-400">{blog.views.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600">{blog.date}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer"
                      className="p-1.5 text-gray-600 hover:text-neon-cyan transition-colors"><FiEye size={13} /></a>
                    <button onClick={() => openEdit(blog)} className="p-1.5 text-gray-600 hover:text-neon-cyan transition-colors"><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-gray-600 hover:text-neon-pink transition-colors"><FiTrash2 size={13} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg text-white">{editBlog ? 'Edit Post' : 'New Blog Post'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><FiX size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input py-2 text-sm" placeholder="Blog post title" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Excerpt</label>
                  <textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="input py-2 text-sm resize-none" placeholder="Short description..." />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Content</label>
                  <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="input py-2 text-sm resize-none" placeholder="Blog content..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Tags</label>
                    <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input py-2 text-sm" placeholder="fashion, style" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input py-2 text-sm">
                      <option value="draft" className="bg-surface-card">Draft</option>
                      <option value="published" className="bg-surface-card">Published</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 py-2"><span>{editBlog ? 'Update' : 'Publish'}</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

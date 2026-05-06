import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiEye } from 'react-icons/fi'
import { getAllProducts } from '@/services/fashionData'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  true:  'bg-neon-green/10 text-neon-green border-neon-green/20',
  false: 'bg-gray-800 text-gray-500 border-gray-700',
}

export default function AdminProducts() {
  const [products, setProducts]   = useState([])
  const [filtered, setFiltered]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const PER_PAGE = 12

  useEffect(() => {
    getAllProducts().then(p => { setProducts(p); setFiltered(p); setLoading(false) })
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q ? products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand?.name.toLowerCase().includes(q)) : products)
    setPage(1)
  }, [search, products])

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product deleted', { style: { background: '#12121f', color: '#fff' } })
  }

  const handleToggle = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
    toast.success('Status updated', { style: { background: '#12121f', color: '#fff' } })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, SKU, brand..."
            className="input pl-9 py-2 text-sm w-full" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
              <FiX size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 font-mono">{filtered.length} products</span>
          <button onClick={() => { setEditProduct(null); setShowModal(true) }}
            className="btn-primary py-2 px-4 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5"><FiPlus size={13} /> Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-600 font-mono uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/3">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="shimmer h-3 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/3 hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="w-9 h-11 object-cover bg-surface-card flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-200 font-medium truncate max-w-[140px] group-hover:text-neon-cyan transition-colors">{p.name}</p>
                        <p className="text-gray-600 text-[10px]">{p.brand?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    {p.sale_price ? (
                      <div>
                        <span className="font-mono font-bold text-neon-gold">₹{p.sale_price.toLocaleString()}</span>
                        <span className="text-gray-600 line-through ml-1">₹{p.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-white">₹{p.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${p.stock < 10 ? 'text-neon-pink' : p.stock < 30 ? 'text-neon-gold' : 'text-neon-green'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(p.id)}
                      className={`px-2 py-0.5 text-[10px] font-mono border capitalize transition-all ${STATUS_STYLE[p.is_active]}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`/products/${p.slug}`} target="_blank" rel="noreferrer"
                        className="p-1.5 text-gray-600 hover:text-neon-cyan transition-colors"><FiEye size={13} /></a>
                      <button onClick={() => { setEditProduct(p); setShowModal(true) }}
                        className="p-1.5 text-gray-600 hover:text-neon-cyan transition-colors"><FiEdit2 size={13} /></button>
                      <button onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-600 hover:text-neon-pink transition-colors"><FiTrash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <p className="text-xs text-gray-600 font-mono">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs border border-white/10 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-30 transition-colors font-mono">
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs font-mono border transition-colors ${page === p ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-white/10 text-gray-500 hover:border-neon-cyan/50'}`}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs border border-white/10 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-30 transition-colors font-mono">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-6 relative"
              onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><FiX size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'name',        label: 'Product Name', col: 2, defaultValue: editProduct?.name || '' },
                  { name: 'price',       label: 'Price (₹)',    defaultValue: editProduct?.price || '' },
                  { name: 'sale_price',  label: 'Sale Price',   defaultValue: editProduct?.sale_price || '' },
                  { name: 'stock',       label: 'Stock',        defaultValue: editProduct?.stock || '' },
                  { name: 'sku',         label: 'SKU',          defaultValue: editProduct?.sku || '' },
                  { name: 'brand',       label: 'Brand',        defaultValue: editProduct?.brand?.name || '' },
                ].map(({ name, label, col, defaultValue }) => (
                  <div key={name} className={col === 2 ? 'col-span-2' : ''}>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">{label}</label>
                    <input name={name} defaultValue={defaultValue} className="input py-2 text-sm" placeholder={label} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Description</label>
                  <textarea rows={3} className="input py-2 text-sm resize-none" placeholder="Product description..." defaultValue={editProduct?.short_description || ''} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                <button onClick={() => {
                  toast.success(editProduct ? 'Product updated!' : 'Product added!', { style: { background: '#12121f', color: '#fff' } })
                  setShowModal(false)
                }} className="btn-primary flex-1 py-2">
                  <span>{editProduct ? 'Update' : 'Add Product'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

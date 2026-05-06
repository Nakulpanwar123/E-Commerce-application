import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX, FiChevronDown } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded']

const STATUS_STYLE = {
  pending:    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  confirmed:  'bg-blue-400/10 text-blue-400 border-blue-400/20',
  processing: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  shipped:    'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  delivered:  'bg-green-400/10 text-green-400 border-green-400/20',
  cancelled:  'bg-red-400/10 text-red-400 border-red-400/20',
  refunded:   'bg-gray-400/10 text-gray-400 border-gray-400/20',
}

const MOCK_ORDERS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  order_number: `FS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  customer: ['Priya Sharma','Rahul Verma','Ananya Singh','Vikram Patel','Sneha Gupta','Arjun Mehta','Kavya Nair','Rohan Das'][i % 8],
  email: `user${i + 1}@example.com`,
  total: Math.round(1000 + Math.random() * 9000),
  items: Math.floor(Math.random() * 4) + 1,
  status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  payment: ['paid','pending','paid','paid','failed'][Math.floor(Math.random() * 5)],
  date: new Date(Date.now() - Math.random() * 30 * 86400000).toLocaleDateString('en-IN'),
}))

export default function AdminOrders() {
  const [orders, setOrders]   = useState(MOCK_ORDERS)
  const [filter, setFilter]   = useState('')
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 10

  const filtered = orders.filter(o => {
    const matchStatus = !filter || o.status === filter
    const matchSearch = !search || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    toast.success(`Order updated to ${status}`, { style: { background: '#12121f', color: '#fff' } })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search order, customer..." className="input pl-9 py-2 text-sm w-full" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><FiX size={13} /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-mono border whitespace-nowrap transition-all capitalize
                ${filter === s ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-white/10 text-gray-500 hover:border-neon-cyan/40 hover:text-gray-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-600 font-mono uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((order, i) => (
                <motion.tr key={order.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-neon-cyan font-bold">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-200">{order.customer}</p>
                    <p className="text-gray-600 text-[10px]">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono">{order.items}</td>
                  <td className="px-4 py-3 font-mono font-bold text-white">₹{order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono border capitalize
                      ${order.payment === 'paid' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : order.payment === 'failed' ? 'bg-neon-pink/10 text-neon-pink border-neon-pink/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono border capitalize ${STATUS_STYLE[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.date}</td>
                  <td className="px-4 py-3">
                    <div className="relative group/sel">
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-[10px] bg-transparent border border-white/10 text-gray-400 py-1 px-2 cursor-pointer hover:border-neon-cyan/50 transition-colors appearance-none pr-5 capitalize">
                        {STATUSES.map(s => <option key={s} value={s} className="bg-surface-card capitalize">{s}</option>)}
                      </select>
                      <FiChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
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
            <p className="text-xs text-gray-600 font-mono">{filtered.length} orders</p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs border border-white/10 text-gray-500 hover:border-neon-cyan/50 disabled:opacity-30 transition-colors font-mono">← Prev</button>
              <span className="px-3 py-1 text-xs font-mono text-gray-400">{page}/{totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs border border-white/10 text-gray-500 hover:border-neon-cyan/50 disabled:opacity-30 transition-colors font-mono">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

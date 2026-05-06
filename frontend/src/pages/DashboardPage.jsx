import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiPackage, FiUser, FiMapPin, FiHeart, FiLogOut, FiShoppingBag } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'

const MOCK_ORDERS = [
  { id: 1, order_number: 'FS-ABC123', status: 'delivered',  total: 4299, created_at: '2024-11-10', items: [{ product_name: 'Quantum Silk Blazer', thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=80&h=96&fit=crop' }] },
  { id: 2, order_number: 'FS-DEF456', status: 'shipped',    total: 2199, created_at: '2024-11-18', items: [{ product_name: 'Neon Edge Hoodie',    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&h=96&fit=crop' }] },
  { id: 3, order_number: 'FS-GHI789', status: 'processing', total: 6799, created_at: '2024-11-22', items: [{ product_name: 'Holographic Dress',   thumbnail: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=80&h=96&fit=crop' }] },
]

const STATUS_STYLE = {
  pending:    { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Pending' },
  confirmed:  { color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30',     label: 'Confirmed' },
  processing: { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', label: 'Processing' },
  shipped:    { color: 'text-neon-cyan',  bg: 'bg-neon-cyan/10 border-neon-cyan/30',   label: 'Shipped' },
  delivered:  { color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/30', label: 'Delivered' },
  cancelled:  { color: 'text-neon-pink',  bg: 'bg-neon-pink/10 border-neon-pink/30',   label: 'Cancelled' },
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const navigate  = useNavigate()
  const user     = useSelector(s => s.auth.user)
  const { count, total } = useCart()
  const [tab, setTab] = useState('orders')

  if (!user) return <Navigate to="/login" replace />

  const TABS = [
    { id: 'orders',   label: 'Orders',    icon: FiPackage },
    { id: 'profile',  label: 'Profile',   icon: FiUser },
    { id: 'wishlist', label: 'Wishlist',  icon: FiHeart },
  ]

  return (
    <>
      <Helmet><title>My Account | FashionStore</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)' }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-neon-cyan text-xs font-mono tracking-widest mb-1">// Welcome back</p>
            <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <p className="font-mono font-bold text-neon-cyan text-xl">{MOCK_ORDERS.length}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Orders</p>
            </div>
            <div className="text-center">
              <p className="font-mono font-bold text-neon-gold text-xl">{count}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider">In Cart</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-52 flex-shrink-0">
            <nav className="glass-card overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b border-white/5 last:border-0
                    ${tab === id ? 'text-neon-cyan bg-neon-cyan/5 border-l-2 border-l-neon-cyan' : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
              <button onClick={() => { dispatch(logoutUser()); navigate('/login') }}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium text-neon-pink hover:bg-neon-pink/5 transition-all duration-200">
                <FiLogOut size={15} /> Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">// Order History</h2>
                {MOCK_ORDERS.map((order, i) => {
                  const st = STATUS_STYLE[order.status] || STATUS_STYLE.pending
                  return (
                    <motion.div key={order.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card p-5 relative hover:border-neon-cyan/20 transition-all duration-300">
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={order.items[0]?.thumbnail} alt=""
                            className="w-14 h-16 object-cover bg-surface-card flex-shrink-0" />
                          <div>
                            <p className="font-mono text-xs text-neon-cyan mb-1">{order.order_number}</p>
                            <p className="text-sm font-medium text-white">{order.items[0]?.product_name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <span className={`badge border text-xs font-mono ${st.bg} ${st.color}`}>{st.label}</span>
                          <p className="font-mono font-bold text-neon-gold">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-6 relative max-w-md">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-6">// Profile Info</h2>
                <div className="space-y-5">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email',     value: user.email },
                    { label: 'Role',      value: user.role },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs text-gray-600 uppercase tracking-widest font-mono mb-1">{label}</label>
                      <p className="text-white font-medium capitalize">{value}</p>
                      <div className="h-px bg-white/5 mt-3" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <FiHeart size={40} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 mb-4 font-mono text-sm">// View your saved items</p>
                <Link to="/wishlist" className="btn-outline text-sm">Go to Wishlist</Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

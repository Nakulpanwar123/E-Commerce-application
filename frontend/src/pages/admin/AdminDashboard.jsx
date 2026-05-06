import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiDollarSign, FiClock, FiTrendingUp, FiUsers, FiPackage, FiArrowUp, FiArrowDown, FiEye } from 'react-icons/fi'
import { getAllProducts } from '@/services/fashionData'

// ── Mock analytics data ───────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Revenue',  value: '₹2,84,500', change: '+18.2%', up: true,  icon: FiDollarSign,  color: 'neon-green',  bg: 'rgba(0,255,136,0.08)'  },
  { label: 'Total Orders',   value: '1,247',      change: '+12.5%', up: true,  icon: FiShoppingBag, color: 'neon-cyan',   bg: 'rgba(0,245,255,0.08)'  },
  { label: 'Active Users',   value: '8,432',      change: '+24.1%', up: true,  icon: FiUsers,       color: 'neon-purple', bg: 'rgba(191,0,255,0.08)'  },
  { label: 'Pending Orders', value: '18',         change: '-5.3%',  up: false, icon: FiClock,       color: 'neon-gold',   bg: 'rgba(255,215,0,0.08)'  },
]

const RECENT_ORDERS = [
  { id: 'FS-A1B2C3', customer: 'Priya Sharma',   total: 4299, status: 'delivered',  date: '2024-11-22', items: 2 },
  { id: 'FS-D4E5F6', customer: 'Rahul Verma',    total: 2199, status: 'shipped',    date: '2024-11-21', items: 1 },
  { id: 'FS-G7H8I9', customer: 'Ananya Singh',   total: 6799, status: 'processing', date: '2024-11-21', items: 3 },
  { id: 'FS-J1K2L3', customer: 'Vikram Patel',   total: 1499, status: 'confirmed',  date: '2024-11-20', items: 1 },
  { id: 'FS-M4N5O6', customer: 'Sneha Gupta',    total: 8999, status: 'pending',    date: '2024-11-20', items: 4 },
  { id: 'FS-P7Q8R9', customer: 'Arjun Mehta',    total: 3299, status: 'delivered',  date: '2024-11-19', items: 2 },
]

const TOP_PRODUCTS = [
  { name: 'Quantum Silk Blazer',   sales: 142, revenue: 60958, img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=60&h=72&fit=crop' },
  { name: 'Holographic Dress',     sales: 118, revenue: 47082, img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=60&h=72&fit=crop' },
  { name: 'Neon Edge Hoodie',      sales: 97,  revenue: 21218, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=60&h=72&fit=crop' },
  { name: 'Cyber Denim Jacket',    sales: 84,  revenue: 33516, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=60&h=72&fit=crop' },
  { name: 'Aurora Maxi Dress',     sales: 76,  revenue: 30324, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=60&h=72&fit=crop' },
]

const STATUS_STYLE = {
  pending:    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  confirmed:  'bg-blue-400/10 text-blue-400 border-blue-400/20',
  processing: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  shipped:    'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  delivered:  'bg-green-400/10 text-green-400 border-green-400/20',
  cancelled:  'bg-red-400/10 text-red-400 border-red-400/20',
}

// Simple bar chart using divs
function MiniChart({ data, color }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <motion.div key={i}
          initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="flex-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          style={{ background: color, minHeight: '4px' }} />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    getAllProducts().then(p => setProductCount(p.length))
  }, [])

  const weeklyRevenue = [42000, 58000, 35000, 71000, 49000, 83000, 62000]
  const weeklyOrders  = [18, 24, 15, 31, 22, 38, 27]

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon, color, bg }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 md:p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: bg }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</p>
                <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ background: bg }}>
                  <Icon size={14} className={`text-${color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold font-mono text-${color} mb-1`}>{value}</p>
              <div className={`flex items-center gap-1 text-xs font-mono ${up ? 'text-neon-green' : 'text-neon-pink'}`}>
                {up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
                {change} <span className="text-gray-600 ml-1">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Weekly Revenue</p>
              <p className="text-xl font-bold text-white font-mono">₹4,00,000</p>
            </div>
            <span className="text-xs text-neon-green font-mono bg-neon-green/10 px-2 py-1">+18.2%</span>
          </div>
          <MiniChart data={weeklyRevenue} color="linear-gradient(180deg,#00f5ff,#bf00ff)" />
          <div className="flex justify-between mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <span key={d} className="text-[10px] text-gray-700 font-mono">{d}</span>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-purple" />
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-4">Quick Stats</p>
          <div className="space-y-4">
            {[
              { label: 'Total Products', value: productCount || 24, color: 'text-neon-cyan',   icon: FiShoppingBag },
              { label: 'Total Customers',value: '8,432',            color: 'text-neon-purple', icon: FiUsers },
              { label: 'Avg Order Value', value: '₹2,281',          color: 'text-neon-gold',   icon: FiDollarSign },
              { label: 'Return Rate',     value: '2.4%',            color: 'text-neon-green',  icon: FiTrendingUp },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={13} className={color} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
                <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 font-mono mb-2">Orders This Week</p>
            <MiniChart data={weeklyOrders} color="#00f5ff" />
          </div>
        </motion.div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden lg:col-span-2 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-neon-cyan hover:underline font-mono">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-gray-600 font-mono uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order, i) => (
                  <motion.tr key={order.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 font-mono text-neon-cyan">{order.id}</td>
                    <td className="px-5 py-3 text-gray-300">{order.customer}</td>
                    <td className="px-5 py-3 font-mono font-bold text-white">₹{order.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-mono border capitalize ${STATUS_STYLE[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{order.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card overflow-hidden relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-purple" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-neon-cyan hover:underline font-mono">View all →</Link>
          </div>
          <div className="p-4 space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-3 group">
                <span className="text-xs text-gray-700 font-mono w-4 flex-shrink-0">{i + 1}</span>
                <img src={p.img} alt={p.name} className="w-10 h-12 object-cover bg-surface-card flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate group-hover:text-neon-cyan transition-colors">{p.name}</p>
                  <p className="text-[10px] text-gray-600 font-mono">{p.sales} sold</p>
                </div>
                <p className="text-xs font-mono font-bold text-neon-gold flex-shrink-0">₹{(p.revenue/1000).toFixed(0)}k</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

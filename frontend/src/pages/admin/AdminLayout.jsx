import { useState } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiShoppingBag, FiPackage, FiTag, FiUsers,
  FiImage, FiFileText, FiMenu, FiX, FiLogOut, FiZap,
  FiSettings, FiBarChart2, FiHome
} from 'react-icons/fi'
import { logoutUser } from '@/store/slices/authSlice'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: FiGrid },
  { to: '/admin/products', label: 'Products',  icon: FiShoppingBag },
  { to: '/admin/orders',   label: 'Orders',    icon: FiPackage },
  { to: '/admin/blogs',    label: 'Blogs',     icon: FiFileText },
  { to: '/admin/coupons',  label: 'Coupons',   icon: FiTag },
  { to: '/admin/users',    label: 'Users',     icon: FiUsers },
  { to: '/admin/banners',  label: 'Banners',   icon: FiImage },
]

export default function AdminLayout() {
  const user     = useSelector(s => s.auth.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Logged out', { style: { background: '#12121f', color: '#fff' } })
    navigate('/login')
  }

  const currentLabel = NAV.find(n => location.pathname === n.to)?.label || 'Admin'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080810' }}>

      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        fixed md:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300`}
        style={{ background: 'linear-gradient(180deg,#0a0a14 0%,#080810 100%)', borderRight: '1px solid rgba(0,245,255,0.08)' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 relative flex-shrink-0">
              <div className="absolute inset-0 rounded-sm rotate-45 bg-gradient-to-br from-neon-cyan to-neon-purple" />
              <FiZap className="absolute inset-0 m-auto text-white" size={13} />
            </div>
            <span className="font-display text-base font-bold">
              <span className="text-white">Fashion</span>
              <span style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin</span>
            </span>
          </Link>
          <button className="md:hidden text-gray-500 hover:text-white" onClick={() => setOpen(false)}>
            <FiX size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)' }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-neon-cyan font-mono">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-200 relative
                  ${active ? 'text-neon-cyan bg-neon-cyan/8' : 'text-gray-500 hover:text-gray-200 hover:bg-white/3'}`}>
                {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-cyan" />}
                <Icon size={15} className={active ? 'text-neon-cyan' : ''} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 p-3 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:text-gray-300 transition-colors">
            <FiHome size={13} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-xs text-neon-pink hover:bg-neon-pink/5 transition-colors">
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0"
          style={{ background: 'rgba(8,8,16,0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-neon-cyan transition-colors" onClick={() => setOpen(true)}>
              <FiMenu size={20} />
            </button>
            <div>
              <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Admin Panel</p>
              <h1 className="text-base font-semibold text-white">{currentLabel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-neon-green/30 bg-neon-green/5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] text-neon-green font-mono">LIVE</span>
            </div>
            <Link to="/" className="text-xs text-gray-500 hover:text-neon-cyan transition-colors font-mono hidden sm:block">
              ← Store
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

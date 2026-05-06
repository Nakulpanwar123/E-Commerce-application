import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiZap, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi'
import { toggleCart, toggleMobileMenu, closeMobileMenu } from '@/store/slices/uiSlice'
import { logoutUser } from '@/store/slices/authSlice'
import { selectCartCount } from '@/store/slices/cartSlice'
import { useCategories } from '@/hooks/useFetch'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { label: 'Men',   href: '/category/men' },
  { label: 'Women', href: '/category/women' },
  { label: 'Kids',  href: '/category/kids' },
  { label: 'Sale',  href: '/sale', neon: true },
  { label: 'Blog',  href: '/blog' },
]

export default function Navbar() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const location   = useLocation()
  const cartCount  = useSelector(selectCartCount)
  const user       = useSelector(s => s.auth.user)
  const mobileOpen = useSelector(s => s.ui.mobileMenuOpen)
  const [scrolled, setScrolled]     = useState(false)
  const [search, setSearch]         = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaMenu, setMegaMenu]     = useState(null)
  const { data: categories }        = useCategories()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { dispatch(closeMobileMenu()) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearchOpen(false)
      setSearch('')
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Logged out successfully', {
      style: { background: '#12121f', color: '#fff', border: '1px solid rgba(0,245,255,0.2)' },
    })
    navigate('/login')
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="overflow-hidden py-2 text-center text-xs tracking-widest uppercase font-mono"
        style={{ background: 'linear-gradient(90deg,#0a0a0f,#1a0a2e,#0a1628,#1a0a2e,#0a0a0f)' }}>
        <span className="text-neon-cyan">⚡ FREE SHIPPING</span>
        <span className="text-gray-600 mx-3">|</span>
        <span className="text-gray-300">Orders above ₹999</span>
        <span className="text-gray-600 mx-3">|</span>
        <span className="text-neon-gold">Code: </span>
        <span className="text-neon-pink font-bold">FUTURE10</span>
        <span className="text-neon-gold"> = 10% off</span>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-neon-cyan/10 shadow-[0_4px_30px_rgba(0,245,255,0.04)]'
                 : 'bg-black/20 backdrop-blur-sm border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-gray-300 hover:text-neon-cyan transition-colors"
              onClick={() => dispatch(toggleMobileMenu())}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 rounded-sm rotate-45 bg-gradient-to-br from-neon-cyan to-neon-purple opacity-80 group-hover:opacity-100 transition-opacity" />
                <FiZap className="absolute inset-0 m-auto text-white" size={15} />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-white">Fashion</span>
                <span style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Store</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <div key={link.href} className="relative"
                  onMouseEnter={() => setMegaMenu(link.label)}
                  onMouseLeave={() => setMegaMenu(null)}>
                  <Link to={link.href}
                    className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 relative pb-1
                      ${link.neon ? 'text-neon-pink' : location.pathname.startsWith(link.href) ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-px transition-all duration-300
                      ${location.pathname.startsWith(link.href) ? 'w-full' : 'w-0 hover:w-full'}`}
                      style={{ background: link.neon ? '#ff006e' : 'linear-gradient(90deg,#00f5ff,#bf00ff)' }} />
                  </Link>

                  {/* Mega Menu */}
                  {['Men','Women','Kids'].includes(link.label) && megaMenu === link.label && (
                    <AnimatePresence>
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 glass-card p-4 z-50">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-purple" />
                        <p className="text-[10px] text-neon-cyan/50 uppercase tracking-widest mb-3 font-mono">{link.label} / Collections</p>
                        {categories?.filter(c => c.slug === link.label.toLowerCase())
                          .flatMap(c => c.children || [])
                          .map(sub => (
                            <Link key={sub.id} to={`/category/${sub.slug}`}
                              className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-neon-cyan transition-colors">
                              <span className="w-1 h-1 rounded-full bg-neon-cyan/30" />{sub.name}
                            </Link>
                          ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-gray-400 hover:text-neon-cyan transition-colors">
                <FiSearch size={18} />
              </button>

              {user ? (
                <div className="relative group">
                  <button className="p-2.5 text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
                    <FiUser size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-52 glass-card hidden group-hover:block z-50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs text-white font-medium truncate">{user.name}</p>
                      <p className="text-[10px] text-neon-cyan font-mono truncate">{user.email}</p>
                    </div>
                    {[
                      { to: '/dashboard', label: 'My Account',  icon: FiUser },
                      { to: '/orders',    label: 'My Orders',   icon: FiPackage },
                      { to: '/wishlist',  label: 'Wishlist',    icon: FiHeart },
                      ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: FiSettings }] : []),
                    ].map(({ to, label, icon: Icon }) => (
                      <Link key={to} to={to}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors">
                        <Icon size={13} />{label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neon-pink hover:bg-neon-pink/5 transition-colors border-t border-white/5">
                      <FiLogOut size={13} />Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2.5 text-gray-400 hover:text-neon-cyan transition-colors">
                  <FiUser size={18} />
                </Link>
              )}

              <Link to="/wishlist" className="p-2.5 text-gray-400 hover:text-neon-pink transition-colors hidden sm:block">
                <FiHeart size={18} />
              </Link>

              <button onClick={() => dispatch(toggleCart())} className="relative p-2.5 text-gray-400 hover:text-neon-cyan transition-colors">
                <FiShoppingBag size={18} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center text-black font-mono"
                      style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', borderRadius: '2px' }}>
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4"
              onClick={() => setSearchOpen(false)}>
              <motion.form initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-2xl glass-card relative"
                onClick={e => e.stopPropagation()} onSubmit={handleSearch}>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple" />
                <div className="flex items-center px-6 py-4 gap-4">
                  <FiSearch size={20} className="text-neon-cyan flex-shrink-0" />
                  <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products, brands, styles..."
                    className="flex-1 text-lg bg-transparent outline-none text-white placeholder-gray-600 font-light" />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                    <FiX size={20} />
                  </button>
                </div>
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  {['Dresses', 'Jackets', 'Hoodies', 'Jeans', 'Blazers'].map(t => (
                    <button key={t} type="button"
                      onClick={() => { navigate(`/products?search=${t}`); setSearchOpen(false) }}
                      className="px-3 py-1 text-xs border border-white/10 text-gray-500 hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors font-mono">
                      {t}
                    </button>
                  ))}
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-40" onClick={() => dispatch(closeMobileMenu())} />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.28 }}
                className="fixed inset-y-0 left-0 w-72 z-50 flex flex-col overflow-y-auto"
                style={{ background: '#0a0a0f', borderRight: '1px solid rgba(0,245,255,0.1)' }}>
                <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
                  <span className="font-display text-xl font-bold text-white">FashionStore</span>
                  <button onClick={() => dispatch(closeMobileMenu())} className="text-gray-500 hover:text-neon-cyan"><FiX size={20} /></button>
                </div>
                {user && (
                  <div className="px-6 py-4 border-b border-white/5 bg-neon-cyan/3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-neon-cyan font-mono">{user.email}</p>
                  </div>
                )}
                <nav className="flex-1 px-4 py-4 space-y-0.5">
                  {NAV_LINKS.map(link => (
                    <Link key={link.href} to={link.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wider uppercase transition-colors
                        ${link.neon ? 'text-neon-pink' : 'text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5'}`}>
                      <span className="w-1 h-1 rounded-full bg-neon-cyan/30" />{link.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/5 pt-3 mt-3 space-y-0.5">
                    {user ? (
                      <>
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors">
                          <FiUser size={14} /> My Account
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-neon-gold hover:bg-neon-gold/5 transition-colors">
                            <FiSettings size={14} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neon-pink hover:bg-neon-pink/5 transition-colors">
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-neon-cyan hover:bg-neon-cyan/5 transition-colors">
                        <FiUser size={14} /> Login / Register
                      </Link>
                    )}
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiZap, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { closeCart } from '@/store/slices/uiSlice'
import { useCart } from '@/hooks/useCart'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const cartOpen = useSelector(s => s.ui.cartOpen)
  const { items, total, remove, update } = useCart()

  const shipping   = total > 0 && total < 999 ? 99 : 0
  const grandTotal = total + shipping

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            onClick={() => dispatch(closeCart())}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 flex flex-col"
            style={{ background: 'linear-gradient(180deg,#0d0d1a 0%,#0a0a0f 100%)', borderLeft: '1px solid rgba(0,245,255,0.12)' }}>

            {/* HUD corners */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-cyan pointer-events-none z-10" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-neon-purple pointer-events-none z-10" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <FiShoppingBag size={18} className="text-neon-cyan" />
                <h2 className="font-display text-lg font-semibold text-white">Shopping Bag</h2>
                <AnimatePresence>
                  {items.length > 0 && (
                    <motion.span key={items.length}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="w-5 h-5 text-xs font-mono font-bold flex items-center justify-center text-black"
                      style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', borderRadius: '2px' }}>
                      {items.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => dispatch(closeCart())}
                className="p-1.5 text-gray-500 hover:text-neon-cyan transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 no-scrollbar">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-20">
                    <FiShoppingBag size={52} className="mx-auto text-gray-800 mb-4" />
                    <p className="text-gray-600 mb-6 font-mono text-sm">// Your bag is empty</p>
                    <button onClick={() => dispatch(closeCart())} className="btn-outline text-sm">
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div key={item.key} layout
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-3 glass-card p-3 group/item">
                      <Link to={`/products/${item.product?.slug}`} onClick={() => dispatch(closeCart())}
                        className="w-20 h-24 flex-shrink-0 overflow-hidden bg-surface-card">
                        <img src={item.product?.thumbnail} alt={item.product?.name}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product?.slug}`} onClick={() => dispatch(closeCart())}
                          className="font-medium text-sm text-gray-200 hover:text-neon-cyan transition-colors line-clamp-1 block">
                          {item.product?.name}
                        </Link>
                        {item.variantId && (
                          <p className="text-xs text-gray-600 mt-0.5 font-mono">Variant selected</p>
                        )}
                        <p className="text-neon-gold font-bold font-mono mt-1 text-sm">
                          ₹{((item.product?.sale_price || item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-white/10">
                            <button onClick={() => update(item.key, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors">
                              <FiMinus size={11} />
                            </button>
                            <span className="w-8 text-center text-xs font-mono text-white">{item.quantity}</span>
                            <button onClick={() => update(item.key, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors">
                              <FiPlus size={11} />
                            </button>
                          </div>
                          <button onClick={() => remove(item.key)}
                            className="text-gray-700 hover:text-neon-pink transition-colors">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/5 flex-shrink-0 space-y-3">
                {shipping > 0 && (
                  <p className="text-xs text-neon-gold/70 font-mono text-center">
                    Add ₹{(999 - total).toLocaleString()} more for FREE shipping
                  </p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono text-white">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-mono ${shipping === 0 ? 'text-neon-green' : 'text-white'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold border-t border-white/5 pt-3">
                  <span className="text-white">Total</span>
                  <span className="font-mono text-neon-gold text-lg">₹{grandTotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full text-center block">
                  <span className="flex items-center justify-center gap-2">
                    <FiZap size={14} /> Checkout — ₹{grandTotal.toLocaleString()}
                  </span>
                </Link>
                <button onClick={() => dispatch(closeCart())}
                  className="w-full text-center text-xs text-gray-600 hover:text-gray-400 transition-colors py-1 flex items-center justify-center gap-1">
                  Continue Shopping <FiArrowRight size={11} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

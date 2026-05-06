import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiCheck, FiPackage, FiArrowRight } from 'react-icons/fi'
import ParticleField from '@/components/ui/ParticleField'

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderNum = params.get('order') || 'FS-XXXXXXX'

  return (
    <>
      <Helmet><title>Order Confirmed | FashionStore</title></Helmet>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        <ParticleField count={20} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-card p-10 md:p-16 text-center max-w-lg w-full relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-neon-purple" />

          {/* Success icon */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-neon-green/20 animate-ping" />
            <div className="relative w-full h-full rounded-full border-2 border-neon-green flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(0,255,136,0.4)' }}>
              <FiCheck size={32} className="text-neon-green" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="text-neon-green text-xs tracking-widest uppercase font-mono mb-2">// Order Confirmed</p>
            <h1 className="font-display text-3xl font-bold text-white mb-3">Thank You!</h1>
            <p className="text-gray-500 mb-6">Your order has been placed successfully. We'll send you a confirmation shortly.</p>

            <div className="glass-card px-6 py-4 mb-8 inline-block">
              <p className="text-xs text-gray-500 font-mono mb-1">Order Number</p>
              <p className="font-mono font-bold text-neon-cyan text-lg tracking-widest">{orderNum}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard" className="btn-outline flex items-center justify-center gap-2">
                <FiPackage size={14} /> Track Order
              </Link>
              <Link to="/products" className="btn-primary">
                <span className="flex items-center gap-2">Continue Shopping <FiArrowRight size={14} /></span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

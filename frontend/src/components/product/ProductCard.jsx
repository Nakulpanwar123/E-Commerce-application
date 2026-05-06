import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiEye, FiCheck } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

export default function ProductCard({ product, index = 0 }) {
  const { add, isInCart }        = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [hovered, setHovered]    = useState(false)
  const [imgLoaded, setImgLoaded]= useState(false)
  const [justAdded, setJustAdded]= useState(false)

  const discount = product.sale_price
    ? Math.round((1 - product.sale_price / product.price) * 100) : null
  const inCart = isInCart(product.id)
  const wishlisted = isWishlisted(product.id)

  const handleAdd = (e) => {
    e.preventDefault()
    add(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="product-card group">

      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-surface-card" style={{ aspectRatio: '3/4' }}>
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}

        <motion.img
          src={product.thumbnail}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Dark overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none"
        />

        {/* Scan line */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: '-100%' }} animate={{ y: '200%' }} exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'linear', repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount && <span className="badge-sale">-{discount}%</span>}
          {!discount && product.is_trending && <span className="badge-trending">⚡ Hot</span>}
          {!discount && !product.is_trending && product.is_featured && <span className="badge-new">✦ New</span>}
        </div>

        {/* Wishlist */}
        <motion.button
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { e.preventDefault(); toggle(product.id) }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center backdrop-blur-md border transition-all duration-300
            ${wishlisted ? 'bg-neon-pink/20 border-neon-pink text-neon-pink' : 'bg-black/50 border-white/20 text-white hover:border-neon-pink hover:text-neon-pink'}`}>
          <FiHeart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick View */}
        <motion.div
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="absolute top-14 right-3 z-10">
          <Link to={`/products/${product.slug}`}
            className="w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 text-white hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300">
            <FiEye size={14} />
          </Link>
        </motion.div>

        {/* Quick Add */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: hovered ? '0%' : '100%' }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-0 left-0 right-0 z-10">
          <button onClick={handleAdd}
            className="w-full py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: justAdded
                ? 'linear-gradient(135deg,rgba(0,255,136,0.9),rgba(0,245,255,0.9))'
                : 'linear-gradient(135deg,rgba(0,245,255,0.92),rgba(191,0,255,0.92))',
              backdropFilter: 'blur(12px)',
              color: '#000',
            }}>
            {justAdded
              ? <><FiCheck size={13} /> Added!</>
              : <><FiShoppingBag size={13} /> {inCart ? 'Add More' : 'Quick Add'}</>}
          </button>
        </motion.div>

        {/* HUD corners */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan transition-opacity duration-300 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan transition-opacity duration-300 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-purple transition-opacity duration-300 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple transition-opacity duration-300 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* ── Info ── */}
      <div className="p-3 md:p-4">
        <p className="text-[10px] text-neon-cyan/60 uppercase tracking-widest mb-1 font-mono truncate">
          {product.brand?.name} · {product.category?.name}
        </p>
        <Link to={`/products/${product.slug}`}
          className="font-medium text-sm text-gray-200 hover:text-neon-cyan transition-colors duration-200 line-clamp-1 block mb-2">
          {product.name}
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {product.sale_price ? (
              <>
                <span className="font-bold text-neon-gold font-mono text-sm">₹{product.sale_price.toLocaleString()}</span>
                <span className="text-gray-600 line-through text-xs font-mono">₹{product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="font-bold text-white font-mono text-sm">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-neon-gold text-xs">★</span>
              <span className="text-xs text-gray-500 font-mono">{product.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Color swatches */}
        {product.variants?.length > 0 && (
          <div className="flex gap-1 mt-2.5">
            {[...new Map(product.variants.map(v => [v.color_hex, v])).values()].slice(0, 6).map(v => (
              <div key={v.color_hex} title={v.color}
                className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0 cursor-pointer hover:scale-125 transition-transform"
                style={{ backgroundColor: v.color_hex }} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

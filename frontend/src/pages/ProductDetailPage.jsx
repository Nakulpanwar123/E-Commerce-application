import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingBag, FiShare2, FiChevronDown, FiChevronUp, FiZap, FiTruck, FiRefreshCw } from 'react-icons/fi'
import { useProduct } from '@/hooks/useFetch'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import toast from 'react-hot-toast'
import ProductGrid from '@/components/product/ProductGrid'
import { TextSkeleton } from '@/components/ui/Skeleton'

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors">
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-neon-cyan" />
          {title}
        </span>
        {open ? <FiChevronUp size={14} className="text-neon-cyan" /> : <FiChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="overflow-hidden">
            <div className="pb-4 text-sm text-gray-500 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug }                          = useParams()
  const { data, loading }                 = useProduct(slug)
  const { add, isInCart }                 = useCart()
  const { toggle, isWishlisted }          = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize]   = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [qty, setQty]                     = useState(1)
  const [addedAnim, setAddedAnim]         = useState(false)

  const product         = data?.product
  const recommendations = data?.recommendations || []

  const sizes  = [...new Set(product?.variants?.map(v => v.size).filter(Boolean))]
  const colors = product?.variants
    ? [...new Map(product.variants.filter(v => v.color).map(v => [v.color, v])).values()]
    : []

  const selectedVariant = product?.variants?.find(v =>
    (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
  )

  const handleAddToCart = async () => {
    if (sizes.length && !selectedSize) { 
      toast.error('Please select a size', { style: { background: '#12121f', color: '#fff' } })
      return 
    }
    add(product, qty, selectedVariant?.id || null)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 2000)
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="shimmer aspect-[3/4]" />
        <div className="space-y-4 pt-4"><TextSkeleton lines={8} /></div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-32">
      <p className="text-neon-cyan font-mono text-lg">// Product not found</p>
      <Link to="/products" className="btn-outline mt-6 inline-block">Browse Products</Link>
    </div>
  )

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean)

  return (
    <>
      <Helmet>
        <title>{product.meta_title || `${product.name} | FashionStore`}</title>
        <meta name="description" content={product.meta_description || product.short_description} />
        <link rel="canonical" href={`https://fashionstore.com/products/${product.slug}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2 font-mono">
          <Link to="/" className="hover:text-neon-cyan transition-colors">home</Link>
          <span className="text-neon-cyan/40">/</span>
          <Link to={`/category/${product.category?.slug}`} className="hover:text-neon-cyan transition-colors capitalize">
            {product.category?.name}
          </Link>
          <span className="text-neon-cyan/40">/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          {/* Gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {images.map((img, i) => (
                <motion.button key={i} onClick={() => setSelectedImage(i)}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square overflow-hidden border-2 transition-all duration-300 flex-shrink-0
                    ${selectedImage === i ? 'border-neon-cyan shadow-neon-cyan' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-surface-card group">
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} src={images[selectedImage]} alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover" />
              </AnimatePresence>

              {/* Scan line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div animate={{ y: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
              </div>

              {/* HUD corners */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-neon-cyan opacity-60" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-neon-purple opacity-60" />

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.sale_price && (
                  <span className="badge-sale">
                    -{Math.round((1 - product.sale_price / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-neon-cyan text-xs tracking-widest uppercase font-mono mb-2">
              {product.brand?.name} · {product.category?.name}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= Math.round(product.avg_rating) ? 'text-neon-gold' : 'text-gray-700'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-400 font-mono">
                  {product.avg_rating.toFixed(1)} <span className="text-gray-600">({product.review_count} reviews)</span>
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6 p-4 glass-card relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
              {product.sale_price ? (
                <>
                  <span className="text-3xl font-bold text-neon-gold font-mono">
                    ₹{product.sale_price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-600 line-through font-mono">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="badge-sale ml-auto">
                    Save ₹{(product.price - product.sale_price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white font-mono">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.short_description}</p>

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-mono">
                  Color: <span className="text-neon-cyan">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(v => (
                    <motion.button key={v.color} onClick={() => setSelectedColor(v.color)}
                      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                      title={v.color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200
                        ${selectedColor === v.color ? 'border-neon-cyan shadow-neon-cyan scale-110' : 'border-white/20 hover:border-white/50'}`}
                      style={{ backgroundColor: v.color_hex }} />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                    Size: <span className="text-neon-cyan">{selectedSize || 'Select'}</span>
                  </p>
                  <button className="text-xs text-neon-cyan/60 hover:text-neon-cyan transition-colors font-mono underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <motion.button key={s} onClick={() => setSelectedSize(s)}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 text-xs font-mono font-bold border transition-all duration-200
                        ${selectedSize === s
                          ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-neon-cyan'
                          : 'border-white/15 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan'}`}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex gap-3 mb-5">
              <div className="flex items-center border border-white/15">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors font-mono">−</button>
                <span className="px-4 py-3 min-w-[3rem] text-center font-mono text-white">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="px-4 py-3 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors font-mono">+</button>
              </div>

              <motion.button onClick={handleAddToCart}
                disabled={product.stock === 0}
                animate={addedAnim ? { scale: [1, 1.05, 1] } : {}}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                <span className="flex items-center gap-2">
                  {addedAnim ? <><FiZap size={16} /> Added!</> : <><FiShoppingBag size={16} /> Add to Bag</>}
                </span>
              </motion.button>

              <motion.button onClick={() => toggle(product.id)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`p-3 border transition-all duration-300
                  ${isWishlisted(product.id)
                    ? 'border-neon-pink text-neon-pink bg-neon-pink/10'
                    : 'border-white/15 text-gray-400 hover:border-neon-pink hover:text-neon-pink'}`}>
                <FiHeart size={20} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: FiTruck,      text: 'Free delivery above ₹999', color: 'text-neon-green' },
                { icon: FiRefreshCw,  text: '30-day easy returns',      color: 'text-neon-cyan' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2 glass-card px-3 py-2">
                  <Icon size={14} className={color} />
                  <span className="text-xs text-gray-400">{text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="border-t border-white/5">
              <AccordionItem title="Product Description" defaultOpen>
                <div className="prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }} />
              </AccordionItem>
              <AccordionItem title="Material & Care">
                <p>Material: {product.material || 'Premium quality fabric blend'}</p>
                <p className="mt-2">Machine wash cold. Do not bleach. Tumble dry low.</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Free shipping on orders above ₹999. Standard delivery in 3-5 business days.</p>
                <p className="mt-2">Easy 30-day returns. Items must be unworn and in original packaging.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/30" />
              <p className="text-neon-cyan text-xs tracking-widest uppercase font-mono">You might also like</p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/30" />
            </div>
            <h2 className="section-title mb-10">Similar Products</h2>
            <ProductGrid products={recommendations} loading={false} />
          </section>
        )}
      </div>
    </>
  )
}

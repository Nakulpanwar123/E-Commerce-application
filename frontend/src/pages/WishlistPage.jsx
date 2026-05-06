import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useState, useEffect } from 'react'
import { getAllProducts } from '@/services/fashionData'

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist()
  const { add }              = useCart()
  const [products, setProducts] = useState([])

  useEffect(() => {
    getAllProducts().then(all => setProducts(all.filter(p => wishlist.includes(p.id))))
  }, [wishlist])

  return (
    <>
      <Helmet><title>Wishlist | FashionStore</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-neon-cyan text-xs tracking-widest uppercase font-mono mb-1">{products.length} saved items</p>
          <h1 className="font-display text-4xl font-bold text-white mb-8">My Wishlist</h1>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <FiHeart size={52} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-600 mb-6 font-mono">// No saved items yet</p>
            <Link to="/products" className="btn-primary"><span>Discover Products</span></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="product-card group">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-card">
                  <img src={product.thumbnail} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={() => toggle(product.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-neon-pink/20 border border-neon-pink text-neon-pink flex items-center justify-center hover:bg-neon-pink hover:text-white transition-all duration-300">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-neon-cyan/60 font-mono mb-1">{product.brand?.name}</p>
                  <Link to={`/products/${product.slug}`} className="text-sm font-medium text-gray-200 hover:text-neon-cyan transition-colors line-clamp-1 block mb-2">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold font-mono text-sm text-neon-gold">
                      ₹{(product.sale_price || product.price).toLocaleString()}
                    </span>
                    <button onClick={() => add(product)}
                      className="flex items-center gap-1 text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-1 hover:bg-neon-cyan/10 transition-colors">
                      <FiShoppingBag size={11} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

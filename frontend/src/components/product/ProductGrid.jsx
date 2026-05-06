import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { FiSearch } from 'react-icons/fi'

export default function ProductGrid({ products, loading, cols = 4 }) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[cols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  if (loading) return <ProductGridSkeleton count={8} />

  if (!products?.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-center py-24">
        <FiSearch size={40} className="mx-auto text-gray-700 mb-4" />
        <p className="text-gray-500 font-mono text-sm mb-2">// No products found</p>
        <p className="text-gray-700 text-xs">Try adjusting your filters</p>
      </motion.div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-3 md:gap-5`}>
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  )
}

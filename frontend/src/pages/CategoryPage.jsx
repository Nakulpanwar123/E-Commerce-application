import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiChevronDown, FiX, FiGrid, FiList } from 'react-icons/fi'
import { useProducts } from '@/hooks/useFetch'
import ProductGrid from '@/components/product/ProductGrid'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORTS = [
  { value: 'latest',     label: 'Latest' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
]

export default function CategoryPage() {
  const { slug }                        = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen]     = useState(false)
  const [filters, setFilters]           = useState({
    category:  slug || 'all',
    sort:      searchParams.get('sort') || 'latest',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    size:      searchParams.get('size') || '',
    search:    searchParams.get('search') || '',
    page:      1,
  })

  useEffect(() => {
    setFilters(f => ({ ...f, category: slug || 'all', page: 1 }))
  }, [slug])

  const { data, loading } = useProducts(filters)

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value, page: key === 'page' ? value : 1 }
    setFilters(next)
    const params = {}
    Object.entries(next).forEach(([k, v]) => { if (v && k !== 'category' && k !== 'page') params[k] = v })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const reset = { category: slug || 'all', sort: 'latest', min_price: '', max_price: '', size: '', search: '', page: 1 }
    setFilters(reset)
    setSearchParams({})
  }

  const products = data?.data || []
  const meta     = data?.meta || {}
  const title    = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'All Products'
  const hasActiveFilters = filters.min_price || filters.max_price || filters.size

  return (
    <>
      <Helmet>
        <title>{title} Collection | FashionStore</title>
        <meta name="description" content={`Shop ${title} collection at FashionStore. Best prices, free shipping above ₹999.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-neon-cyan text-xs tracking-widest uppercase font-mono mb-1">
              {meta.total || 0} items found
            </p>
            <h1 className="font-display text-4xl font-bold text-white capitalize">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                className="input pr-8 py-2 text-sm appearance-none cursor-pointer text-gray-300 min-w-[160px]">
                {SORTS.map(s => <option key={s.value} value={s.value} className="bg-surface-card">{s.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={14} />
            </div>

            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-2 text-sm border transition-all duration-300 font-mono
                ${filterOpen || hasActiveFilters
                  ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5'
                  : 'border-white/20 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan'}`}>
              <FiFilter size={14} />
              Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />}
            </button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <AnimatePresence>
            {(filterOpen) && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 220 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="flex-shrink-0 overflow-hidden">
                <div className="w-52 glass-card p-5 sticky top-24">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xs font-mono text-neon-cyan uppercase tracking-widest">Filters</h3>
                    <button onClick={clearFilters}
                      className="text-xs text-gray-500 hover:text-neon-pink flex items-center gap-1 transition-colors">
                      <FiX size={11} /> Clear
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={filters.min_price}
                        onChange={e => updateFilter('min_price', e.target.value)}
                        className="input py-2 text-xs w-full" />
                      <input type="number" placeholder="Max" value={filters.max_price}
                        onChange={e => updateFilter('max_price', e.target.value)}
                        className="input py-2 text-xs w-full" />
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(s => (
                        <button key={s} onClick={() => updateFilter('size', filters.size === s ? '' : s)}
                          className={`w-10 h-10 text-xs font-mono font-medium border transition-all duration-200
                            ${filters.size === s
                              ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-neon-cyan'
                              : 'border-white/15 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {meta.last_page > 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-12">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => updateFilter('page', page)}
                    className={`w-10 h-10 text-sm font-mono border transition-all duration-200
                      ${meta.current_page === page
                        ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-neon-cyan'
                        : 'border-white/15 text-gray-400 hover:border-neon-cyan/50'}`}>
                    {page}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

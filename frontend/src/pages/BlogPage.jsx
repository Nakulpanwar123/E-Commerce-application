import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFetch } from '@/hooks/useFetch'
import { FiCalendar, FiTag, FiArrowRight } from 'react-icons/fi'

export default function BlogPage() {
  const { data, loading } = useFetch('/blogs')
  const blogs = data?.data || []

  return (
    <>
      <Helmet>
        <title>Fashion Blog | FashionStore</title>
        <meta name="description" content="Fashion tips, style guides, and trend reports from FashionStore." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-cyan" />
            <p className="section-subtitle mb-0">Style & Inspiration</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-cyan" />
          </div>
          <h1 className="section-title">Fashion Blog</h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="shimmer aspect-video" />
                <div className="p-5 space-y-3">
                  <div className="shimmer h-3 w-1/3 rounded" />
                  <div className="shimmer h-4 w-full rounded" />
                  <div className="shimmer h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.article key={blog.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group hover:border-neon-cyan/30 transition-all duration-500">
                <Link to={`/blog/${blog.slug}`}>
                  <div className="aspect-video overflow-hidden relative">
                    <motion.img src={blog.thumbnail} alt={blog.title}
                      whileHover={{ scale: 1.06 }} transition={{ duration: 0.6 }}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {blog.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-neon-cyan font-mono">
                          <FiTag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                        <FiCalendar size={11} />
                        {new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More <FiArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

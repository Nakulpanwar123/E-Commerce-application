import { useState, useEffect, useCallback, useRef } from 'react'
import { getHomeData, getProductBySlug, getProductsByCategory, getAllProducts } from '@/services/fashionData'

export function useHomeData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeData().then(d => { setData(d); setLoading(false) })
  }, [])

  return { data, loading }
}

export function useProducts(filters = {}) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const key = JSON.stringify(filters)

  useEffect(() => {
    setLoading(true)
    const slug = filters.category || 'all'
    getProductsByCategory(slug, filters).then(d => { setData(d); setLoading(false) })
  }, [key])

  return { data, loading }
}

export function useProduct(slug) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductBySlug(slug).then(d => { setData(d); setLoading(false) })
  }, [slug])

  return { data, loading }
}

export function useCategories() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeData().then(d => { setData(d.categories); setLoading(false) })
  }, [])

  return { data, loading }
}

// Generic fetch hook for API calls (used by admin/orders etc.)
export function useFetch(url, params = {}, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      // For admin stats — return mock data since backend isn't running
      if (url === '/admin/stats') {
        setData({ total_orders: 142, total_revenue: 284500, pending_orders: 18, today_orders: 7, today_revenue: 14200 })
        setLoading(false); return
      }
      if (url === '/admin/orders' || url === '/orders') {
        setData({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } })
        setLoading(false); return
      }
      if (url === '/wishlist') { setData([]); setLoading(false); return }
      if (url === '/blogs') {
        setData({ data: BLOG_POSTS }); setLoading(false); return
      }
      // fallback — backend not running, return empty
      setData(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [url, JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch, ...deps])

  return { data, loading, error, refetch: fetch }
}

const BLOG_POSTS = [
  { id: 1, title: 'The Future of Fashion: AI-Designed Clothing', slug: 'future-of-fashion-ai', excerpt: 'How artificial intelligence is revolutionizing the way we design and wear clothes.', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', tags: ['AI', 'Future', 'Design'], published_at: '2024-11-01', is_published: true },
  { id: 2, title: 'Sustainable Fashion: Dressing for Tomorrow', slug: 'sustainable-fashion-2024', excerpt: 'Eco-conscious choices that don\'t compromise on style or performance.', thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop', tags: ['Sustainable', 'Eco', 'Style'], published_at: '2024-10-20', is_published: true },
  { id: 3, title: 'Cyberpunk Aesthetics in Everyday Wear', slug: 'cyberpunk-fashion-everyday', excerpt: 'Bringing the neon-lit streets of the future into your daily wardrobe.', thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop', tags: ['Cyberpunk', 'Streetwear', 'Neon'], published_at: '2024-10-10', is_published: true },
]

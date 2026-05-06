import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useHomeData } from '@/hooks/useFetch'
import ProductGrid from '@/components/product/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import ParticleField from '@/components/ui/ParticleField'
import { TypewriterText, NeonCounter } from '@/components/ui/GlitchText'
import { FiArrowRight, FiZap, FiTrendingUp, FiStar, FiShield } from 'react-icons/fi'

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ banners }) {
  const slides = banners?.length ? banners : [
    { id: 0, title: 'Future of Fashion', subtitle: 'Wear Tomorrow, Today', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=800&fit=crop', link: '/category/women', cta_text: 'Explore Collection' },
    { id: 1, title: "Men's New Season",  subtitle: 'Redefine Your Style',  image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1400&h=800&fit=crop', link: '/category/men',   cta_text: 'Shop Men' },
  ]

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <ParticleField count={30} />

      <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }} loop className="h-full">
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              {/* Background */}
              <motion.img src={slide.image} alt={slide.title}
                initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'linear' }}
                className="absolute inset-0 w-full h-full object-cover" />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-px bg-neon-cyan" />
                      <span className="text-neon-cyan text-xs tracking-widest uppercase font-mono">
                        SS 2025 Collection
                      </span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-none">
                      {slide.title.split(' ').map((word, wi) => (
                        <motion.span key={wi}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + wi * 0.1 }}
                          className={`block ${wi === slide.title.split(' ').length - 1 ? 'text-neon-gradient' : ''}`}
                          style={wi === slide.title.split(' ').length - 1 ? {
                            background: 'linear-gradient(135deg,#00f5ff,#bf00ff)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                          } : {}}>
                          {word}
                        </motion.span>
                      ))}
                    </h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                      className="text-gray-300 text-lg md:text-xl mb-8 max-w-md font-light">
                      {slide.subtitle}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                      className="flex flex-wrap gap-4">
                      <Link to={slide.link || '/products'} className="btn-primary group">
                        <span className="flex items-center gap-2">
                          {slide.cta_text || 'Shop Now'}
                          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                      <Link to="/products" className="btn-outline">
                        View All
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom stats bar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                className="absolute bottom-12 right-6 md:right-12 hidden md:flex gap-8">
                {[
                  { val: '10K+', label: 'Products' },
                  { val: '50K+', label: 'Customers' },
                  { val: '4.9★', label: 'Rating' },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center glass-card px-4 py-3">
                    <div className="font-mono font-bold text-neon-cyan text-lg">{val}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <div className="w-px h-8 bg-gradient-to-b from-neon-cyan to-transparent" />
        <span className="text-xs text-neon-cyan/60 font-mono tracking-widest">SCROLL</span>
      </motion.div>
    </section>
  )
}

// ── Category Grid ─────────────────────────────────────────────────────────────
function CategoryGrid({ categories }) {
  const roots = categories?.filter(c => !c.parent_id) || []
  const IMGS = [
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop',
  ]

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="section-subtitle">Shop by Category</p>
        <h2 className="section-title mb-12">Explore Collections</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {(roots.length ? roots : [
          { id: 1, name: 'Men',         slug: 'men' },
          { id: 2, name: 'Women',       slug: 'women' },
          { id: 3, name: 'Kids',        slug: 'kids' },
          { id: 9, name: 'Accessories', slug: 'accessories' },
        ]).map((cat, i) => (
          <motion.div key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}>
            <Link to={`/category/${cat.slug}`}
              className="relative block overflow-hidden group"
              style={{ aspectRatio: i === 0 ? '3/4' : i === 1 ? '3/5' : '3/4' }}>
              <motion.img
                src={cat.image || IMGS[i % IMGS.length]}
                alt={cat.name}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Neon border on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-neon-cyan/40 transition-all duration-500" />
              {/* HUD corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-white text-2xl font-bold">{cat.name}</h3>
                <motion.div initial={{ width: 0 }} whileHover={{ width: '100%' }}
                  className="h-px bg-gradient-to-r from-neon-cyan to-neon-purple mt-2" />
                <p className="text-neon-cyan text-xs tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                  Explore →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function BrandMarquee() {
  const brands = ['ZARA', 'H&M', 'MANGO', "LEVI'S", 'NIKE', 'ADIDAS', 'GUCCI', 'PRADA', 'VERSACE', 'CALVIN KLEIN', 'ARMANI', 'DIOR']
  return (
    <div className="py-6 overflow-hidden border-y border-white/5 relative">
      <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-xs font-mono tracking-widest text-gray-600 hover:text-neon-cyan transition-colors cursor-default flex-shrink-0">
            {b}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

// ── Futuristic Section Header ─────────────────────────────────────────────────
function SectionHeader({ subtitle, title, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-cyan" />
        <p className="section-subtitle mb-0">{subtitle}</p>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-cyan" />
      </div>
      <h2 className="section-title">{title}</h2>
      {accent && <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">{accent}</p>}
    </motion.div>
  )
}

// ── Mid Banner ────────────────────────────────────────────────────────────────
function MidBanner({ banner }) {
  if (!banner) return null
  return (
    <section className="relative h-72 md:h-[420px] overflow-hidden my-4">
      <motion.img src={banner.image} alt={banner.title}
        whileHover={{ scale: 1.03 }} transition={{ duration: 0.8 }}
        className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 flex items-center px-8 md:px-20">
        <div>
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-neon-cyan text-xs tracking-widest uppercase font-mono mb-3">
            ⚡ Limited Time Offer
          </motion.p>
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            {banner.title}
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link to={banner.link || '/sale'} className="btn-primary">
              <span className="flex items-center gap-2">{banner.cta_text || 'Shop Sale'} <FiArrowRight size={16} /></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── USP Strip ─────────────────────────────────────────────────────────────────
function USPStrip() {
  const items = [
    { icon: FiZap,      label: 'Express Delivery',  desc: '2-4 business days',    color: 'text-neon-cyan' },
    { icon: FiShield,   label: 'Secure Payments',   desc: '256-bit SSL encrypted', color: 'text-neon-green' },
    { icon: FiTrendingUp, label: 'Easy Returns',    desc: '30-day hassle-free',    color: 'text-neon-purple' },
    { icon: FiStar,     label: 'Premium Quality',   desc: 'Curated collections',   color: 'text-neon-gold' },
  ]
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, label, desc, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center group hover:scale-105 transition-transform duration-300">
              <Icon size={28} className={`${color} mx-auto mb-3 group-hover:animate-bounce-slow`} />
              <h4 className="font-semibold text-white text-sm mb-1">{label}</h4>
              <p className="text-gray-500 text-xs">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, loading } = useHomeData()

  return (
    <>
      <Helmet>
        <title>FashionStore — Future of Fashion | Premium Clothing</title>
        <meta name="description" content="Shop the future of fashion at FashionStore. Premium clothing for men, women & kids. Free shipping above ₹999." />
        <link rel="canonical" href="https://fashionstore.com" />
      </Helmet>

      <HeroSection banners={data?.banners} />
      <BrandMarquee />
      <CategoryGrid categories={data?.categories} />

      {/* Featured */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader subtitle="Handpicked for you" title="Featured Collection" accent="Curated pieces from the world's top designers" />
        {loading ? <ProductGridSkeleton /> : <ProductGrid products={data?.featured} loading={false} />}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mt-12">
          <Link to="/products" className="btn-outline">
            View All Products
          </Link>
        </motion.div>
      </section>

      <MidBanner banner={data?.mid_banners?.[0]} />

      {/* Trending */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader subtitle="What's hot right now" title="Trending Now" />
        {loading ? <ProductGridSkeleton /> : <ProductGrid products={data?.trending} loading={false} />}
      </section>

      {/* New Arrivals */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader subtitle="Just dropped" title="New Arrivals" />
          {loading ? <ProductGridSkeleton /> : <ProductGrid products={data?.new_arrivals} loading={false} />}
        </div>
      </section>

      <USPStrip />

      {/* Stats */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-purple" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            <NeonCounter value="50K+" label="Happy Customers" color="cyan" />
            <NeonCounter value="10K+" label="Products"        color="purple" />
            <NeonCounter value="4.9★" label="Avg Rating"      color="gold" />
            <NeonCounter value="99%"  label="Satisfaction"    color="green" />
          </div>
        </div>
      </section>
    </>
  )
}

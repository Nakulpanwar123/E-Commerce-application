/**
 * Real product data from DummyJSON API (https://dummyjson.com)
 * Maps clothing/fashion categories to our product schema
 */

const DUMMYJSON = 'https://dummyjson.com'

// Fashion-specific image sets from Unsplash (free, no auth needed)
const FASHION_IMAGES = {
  men: [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop',
  ],
  women: [
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop',
  ],
  kids: [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop',
  ],
}

const BRANDS = ['Zara', 'H&M', 'Mango', "Levi's", 'Nike', 'Adidas', 'Gucci', 'Prada', 'Versace', 'Calvin Klein']
const SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = [
  { name: 'Midnight Black', hex: '#0a0a0a' },
  { name: 'Pearl White',    hex: '#f5f5f0' },
  { name: 'Neon Cyan',      hex: '#00f5ff' },
  { name: 'Deep Purple',    hex: '#4a0080' },
  { name: 'Rose Gold',      hex: '#b76e79' },
  { name: 'Electric Blue',  hex: '#0066ff' },
  { name: 'Crimson Red',    hex: '#dc143c' },
  { name: 'Forest Green',   hex: '#228b22' },
]

const CATEGORIES = [
  { id: 1, name: 'Men',         slug: 'men',         image: FASHION_IMAGES.men[0],         parent_id: null },
  { id: 2, name: 'Women',       slug: 'women',       image: FASHION_IMAGES.women[0],       parent_id: null },
  { id: 3, name: 'Kids',        slug: 'kids',        image: FASHION_IMAGES.kids[0],        parent_id: null },
  { id: 4, name: 'T-Shirts',    slug: 't-shirts',    image: FASHION_IMAGES.men[1],         parent_id: 1 },
  { id: 5, name: 'Shirts',      slug: 'shirts',      image: FASHION_IMAGES.men[2],         parent_id: 1 },
  { id: 6, name: 'Jeans',       slug: 'jeans',       image: FASHION_IMAGES.men[3],         parent_id: 1 },
  { id: 7, name: 'Dresses',     slug: 'dresses',     image: FASHION_IMAGES.women[1],       parent_id: 2 },
  { id: 8, name: 'Tops',        slug: 'tops',        image: FASHION_IMAGES.women[2],       parent_id: 2 },
  { id: 9, name: 'Accessories', slug: 'accessories', image: FASHION_IMAGES.accessories[0], parent_id: null },
]

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function mapDummyProduct(p, index) {
  const isMen   = p.category === "men's clothing"
  const isWomen = p.category === "women's clothing"
  const imgSet  = isMen ? FASHION_IMAGES.men : isWomen ? FASHION_IMAGES.women : FASHION_IMAGES.accessories
  const catId   = isMen ? 1 : isWomen ? 2 : 9
  const cat     = CATEGORIES.find(c => c.id === catId)
  const price   = Math.round(p.price * 83) // USD to INR
  const hasSale = index % 3 === 0
  const brand   = BRANDS[index % BRANDS.length]

  return {
    id:                p.id,
    name:              p.title,
    slug:              slugify(p.title) + '-' + p.id,
    short_description: p.description,
    description:       `<p>${p.description}</p><p>Premium quality ${p.category} item crafted with attention to detail. Perfect for every occasion.</p>`,
    price:             price,
    sale_price:        hasSale ? Math.round(price * 0.75) : null,
    sku:               `SKU-${String(p.id).padStart(4, '0')}`,
    stock:             Math.floor(Math.random() * 80) + 20,
    thumbnail:         imgSet[index % imgSet.length],
    images:            [imgSet[index % imgSet.length], imgSet[(index + 1) % imgSet.length], imgSet[(index + 2) % imgSet.length]],
    avg_rating:        p.rating?.rate || (3.5 + Math.random() * 1.5),
    review_count:      p.rating?.count || Math.floor(Math.random() * 200) + 10,
    is_active:         true,
    is_featured:       index < 8,
    is_trending:       index >= 8 && index < 16,
    category_id:       catId,
    category:          cat,
    brand:             { id: index % 10 + 1, name: brand, slug: slugify(brand) },
    tags:              [p.category, brand.toLowerCase(), 'fashion', 'premium'],
    meta_title:        `${p.title} | FashionStore`,
    meta_description:  p.description.slice(0, 155),
    variants:          SIZES.flatMap((size, si) =>
      COLORS.slice(0, 4).map((color, ci) => ({
        id:         p.id * 100 + si * 10 + ci,
        size,
        color:      color.name,
        color_hex:  color.hex,
        stock:      Math.floor(Math.random() * 15),
        price_modifier: 0,
        sku:        `SKU-${p.id}-${size}-${ci}`,
      }))
    ),
  }
}

// ── Fetch from DummyJSON ──────────────────────────────────────────────────────

async function fetchDummyProducts() {
  try {
    const [menRes, womenRes, jewelryRes] = await Promise.all([
      fetch(`${DUMMYJSON}/products/category/mens-shirts?limit=10`),
      fetch(`${DUMMYJSON}/products/category/womens-dresses?limit=10`),
      fetch(`${DUMMYJSON}/products/category/womens-bags?limit=5`),
    ])
    const [men, women, jewelry] = await Promise.all([menRes.json(), womenRes.json(), jewelryRes.json()])
    const all = [...(men.products || []), ...(women.products || []), ...(jewelry.products || [])]
    return all.map((p, i) => mapDummyProduct(p, i))
  } catch {
    return generateFallbackProducts()
  }
}

function generateFallbackProducts() {
  const names = [
    'Quantum Silk Blazer', 'Neon Edge Hoodie', 'Cyber Denim Jacket', 'Holographic Dress',
    'Matrix Turtleneck', 'Plasma Joggers', 'Void Black Tee', 'Aurora Maxi Dress',
    'Circuit Board Shirt', 'Nebula Crop Top', 'Dark Matter Jeans', 'Prism Windbreaker',
    'Stellar Wrap Dress', 'Fusion Bomber Jacket', 'Pixel Art Sweater', 'Gravity Defying Coat',
    'Bioluminescent Blouse', 'Titanium Cargo Pants', 'Quantum Mesh Top', 'Nanotech Leggings',
    'Hyperspace Cardigan', 'Antimatter Skirt', 'Photon Vest', 'Warp Drive Jumpsuit',
  ]
  return names.map((name, i) => {
    const isMen   = i % 3 !== 1
    const imgSet  = isMen ? FASHION_IMAGES.men : FASHION_IMAGES.women
    const catId   = isMen ? 1 : 2
    const cat     = CATEGORIES.find(c => c.id === catId)
    const price   = Math.round(1200 + Math.random() * 8000)
    const brand   = BRANDS[i % BRANDS.length]
    return {
      id:                i + 1,
      name,
      slug:              slugify(name) + '-' + (i + 1),
      short_description: `Premium ${name.toLowerCase()} crafted for the future-forward individual.`,
      description:       `<p>Experience the future of fashion with our ${name}. Engineered with cutting-edge materials and avant-garde design philosophy.</p>`,
      price,
      sale_price:        i % 3 === 0 ? Math.round(price * 0.75) : null,
      sku:               `FS-${String(i + 1).padStart(4, '0')}`,
      stock:             Math.floor(Math.random() * 80) + 10,
      thumbnail:         imgSet[i % imgSet.length],
      images:            [imgSet[i % imgSet.length], imgSet[(i + 1) % imgSet.length]],
      avg_rating:        3.5 + Math.random() * 1.5,
      review_count:      Math.floor(Math.random() * 300) + 5,
      is_active:         true,
      is_featured:       i < 8,
      is_trending:       i >= 8 && i < 16,
      category_id:       catId,
      category:          cat,
      brand:             { id: i % 10 + 1, name: brand, slug: slugify(brand) },
      tags:              ['fashion', 'premium', 'futuristic'],
      meta_title:        `${name} | FashionStore`,
      meta_description:  `Buy ${name} at FashionStore. Premium quality fashion.`,
      variants:          SIZES.flatMap((size, si) =>
        COLORS.slice(0, 3).map((color, ci) => ({
          id: (i + 1) * 100 + si * 10 + ci,
          size, color: color.name, color_hex: color.hex,
          stock: Math.floor(Math.random() * 15), price_modifier: 0,
          sku: `FS-${i + 1}-${size}-${ci}`,
        }))
      ),
    }
  })
}

// ── Singleton cache ───────────────────────────────────────────────────────────
let _cache = null
let _fetching = null
const CUSTOM_KEY = 'fs_custom_products'

export async function getAllProducts() {
  if (_cache) return _cache
  if (_fetching) return _fetching
  _fetching = fetchDummyProducts().then(data => {
    // Merge any admin-added products
    const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
    _cache = [...data, ...custom]
    _fetching = null
    return _cache
  })
  return _fetching
}

export function addCustomProduct(product) {
  const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
  const newProduct = {
    ...product,
    id: Date.now(),
    slug: slugify(product.name) + '-' + Date.now(),
    avg_rating: 0,
    review_count: 0,
    is_active: true,
    category: CATEGORIES.find(c => c.id === Number(product.category_id)) || CATEGORIES[0],
    brand: { id: 99, name: product.brand_name || 'Custom', slug: slugify(product.brand_name || 'custom') },
    variants: (product.sizes || []).flatMap((size, si) =>
      (product.colors || []).map((color, ci) => ({
        id: Date.now() + si * 10 + ci,
        size, color: color.name, color_hex: color.hex,
        stock: Number(product.stock) || 10, price_modifier: 0,
        sku: `${product.sku}-${size}-${ci}`,
      }))
    ),
  }
  custom.push(newProduct)
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom))
  if (_cache) _cache.push(newProduct)
  return newProduct
}

export function updateCustomProduct(id, updates) {
  if (_cache) {
    const idx = _cache.findIndex(p => p.id === id)
    if (idx >= 0) _cache[idx] = { ..._cache[idx], ...updates }
  }
  const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
  const idx = custom.findIndex(p => p.id === id)
  if (idx >= 0) {
    custom[idx] = { ...custom[idx], ...updates }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom))
  }
}

export function deleteProduct(id) {
  if (_cache) _cache = _cache.filter(p => p.id !== id)
  const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom.filter(p => p.id !== id)))
}

// Reviews stored in localStorage
const REVIEWS_KEY = 'fs_reviews'
export function getReviews(productId) {
  const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}')
  return all[productId] || []
}
export function addReview(productId, review) {
  const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}')
  if (!all[productId]) all[productId] = []
  const newReview = { ...review, id: Date.now(), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  all[productId].unshift(newReview)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all))
  return newReview
}

export async function getHomeData() {
  const products = await getAllProducts()
  return {
    banners: [
      { id: 1, title: 'Future of Fashion', subtitle: 'Wear Tomorrow, Today', image: FASHION_IMAGES.women[7], position: 'hero', link: '/category/women', cta_text: 'Explore Collection' },
      { id: 2, title: 'Men\'s New Season', subtitle: 'Redefine Your Style', image: FASHION_IMAGES.men[5],   position: 'hero', link: '/category/men',   cta_text: 'Shop Men' },
      { id: 3, title: 'Accessories Drop', subtitle: 'Complete the Look',   image: FASHION_IMAGES.accessories[1], position: 'hero', link: '/category/accessories', cta_text: 'Shop Now' },
    ],
    categories:   CATEGORIES.filter(c => !c.parent_id).map(c => ({ ...c, children: CATEGORIES.filter(ch => ch.parent_id === c.id) })),
    featured:     products.filter(p => p.is_featured),
    trending:     products.filter(p => p.is_trending),
    new_arrivals: products.slice(-8),
    mid_banners:  [{ id: 10, title: 'Up to 40% Off', subtitle: 'Limited Time Sale', image: FASHION_IMAGES.women[4], link: '/sale', cta_text: 'Shop Sale' }],
  }
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts()
  const product  = products.find(p => p.slug === slug)
  if (!product) return null
  const recommendations = products.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 8)
  return { product, recommendations }
}

export async function getProductsByCategory(slug, filters = {}) {
  const products = await getAllProducts()
  let filtered = products.filter(p => p.is_active)

  if (slug && slug !== 'all') {
    const cat = CATEGORIES.find(c => c.slug === slug)
    if (cat) {
      const catIds = [cat.id, ...CATEGORIES.filter(c => c.parent_id === cat.id).map(c => c.id)]
      filtered = filtered.filter(p => catIds.includes(p.category_id))
    }
  }

  if (filters.search)    filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()))
  if (filters.min_price) filtered = filtered.filter(p => p.price >= Number(filters.min_price))
  if (filters.max_price) filtered = filtered.filter(p => p.price <= Number(filters.max_price))
  if (filters.size)      filtered = filtered.filter(p => p.variants?.some(v => v.size === filters.size))

  switch (filters.sort) {
    case 'price_asc':  filtered.sort((a, b) => a.price - b.price); break
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break
    case 'rating':     filtered.sort((a, b) => b.avg_rating - a.avg_rating); break
    case 'popular':    filtered.sort((a, b) => b.review_count - a.review_count); break
    default:           filtered.sort((a, b) => b.id - a.id)
  }

  const page    = Number(filters.page) || 1
  const perPage = Number(filters.per_page) || 20
  const total   = filtered.length
  const data    = filtered.slice((page - 1) * perPage, page * perPage)

  return { data, meta: { total, current_page: page, last_page: Math.ceil(total / perPage), per_page: perPage } }
}

export { CATEGORIES, FASHION_IMAGES, BRANDS, SIZES, COLORS }

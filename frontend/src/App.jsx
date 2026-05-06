import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/pages/admin/AdminLayout'

const HomePage          = lazy(() => import('@/pages/HomePage'))
const CategoryPage      = lazy(() => import('@/pages/CategoryPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CheckoutPage      = lazy(() => import('@/pages/CheckoutPage'))
const OrderSuccessPage  = lazy(() => import('@/pages/OrderSuccessPage'))
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'))
const AuthPage          = lazy(() => import('@/pages/AuthPage'))
const BlogPage          = lazy(() => import('@/pages/BlogPage'))
const WishlistPage      = lazy(() => import('@/pages/WishlistPage'))
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProducts     = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminOrders       = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminBlogs        = lazy(() => import('@/pages/admin/AdminBlogs'))
const AdminCoupons      = lazy(() => import('@/pages/admin/AdminCoupons'))
const AdminUsers        = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminBanners      = lazy(() => import('@/pages/admin/AdminBanners'))

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const token = useSelector(s => s.auth.token)
  if (token) return <Navigate to="/" replace />
  return children
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border border-neon-cyan/20" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-neon-cyan animate-spin" />
          <div className="absolute inset-1 rounded-full border border-transparent border-b-neon-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-[10px] text-gray-700 font-mono tracking-widest animate-pulse">LOADING...</p>
      </div>
    </div>
  )
}

function Wrap({ children }) {
  return <MainLayout><Suspense fallback={<PageLoader />}>{children}</Suspense></MainLayout>
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Wrap><HomePage /></Wrap>} />
          <Route path="/category/:slug" element={<Wrap><CategoryPage /></Wrap>} />
          <Route path="/products"       element={<Wrap><CategoryPage /></Wrap>} />
          <Route path="/products/:slug" element={<Wrap><ProductDetailPage /></Wrap>} />
          <Route path="/sale"           element={<Wrap><CategoryPage /></Wrap>} />
          <Route path="/blog"           element={<Wrap><BlogPage /></Wrap>} />
          <Route path="/wishlist"       element={<Wrap><WishlistPage /></Wrap>} />
          <Route path="/order-success"  element={<Wrap><OrderSuccessPage /></Wrap>} />

          {/* Guest only */}
          <Route path="/login"    element={<GuestRoute><Wrap><AuthPage mode="login" /></Wrap></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Wrap><AuthPage mode="register" /></Wrap></GuestRoute>} />

          {/* Protected */}
          <Route path="/checkout"  element={<ProtectedRoute><Wrap><CheckoutPage /></Wrap></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Wrap><DashboardPage /></Wrap></ProtectedRoute>} />
          <Route path="/orders"    element={<ProtectedRoute><Wrap><DashboardPage /></Wrap></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index          element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
            <Route path="orders"   element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
            <Route path="blogs"    element={<Suspense fallback={<PageLoader />}><AdminBlogs /></Suspense>} />
            <Route path="coupons"  element={<Suspense fallback={<PageLoader />}><AdminCoupons /></Suspense>} />
            <Route path="users"    element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
            <Route path="banners"  element={<Suspense fallback={<PageLoader />}><AdminBanners /></Suspense>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <Wrap>
              <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="font-mono text-neon-cyan text-xs tracking-widest mb-4">// ERROR 404</p>
                  <h1 className="font-display text-8xl font-bold mb-4"
                    style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    404
                  </h1>
                  <p className="text-gray-500 mb-8 font-mono text-sm">// This page doesn't exist in our universe</p>
                  <a href="/" className="btn-primary"><span>Return Home</span></a>
                </motion.div>
              </div>
            </Wrap>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

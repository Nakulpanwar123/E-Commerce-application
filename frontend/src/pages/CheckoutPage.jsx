import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiCreditCard, FiTruck, FiCheck, FiArrowLeft, FiZap, FiShield } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import { clearCart } from '@/store/slices/cartSlice'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const user       = useSelector(s => s.auth.user)
  const { items, total, count } = useCart()
  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [coupon, setCoupon]     = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [form, setForm] = useState({
    full_name:    user?.name || '',
    phone:        '',
    address_line1:'',
    address_line2:'',
    city:         '',
    state:        '',
    pincode:      '',
    country:      'India',
  })

  const shipping   = total >= 999 ? 0 : 99
  const tax        = Math.round((total - discount) * 0.05)
  const grandTotal = total - discount + shipping + tax

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const applyCoupon = () => {
    const codes = { FUTURE10: 10, SAVE20: 20, FIRST15: 15 }
    const pct = codes[coupon.toUpperCase()]
    if (pct) {
      setDiscount(Math.round(total * pct / 100))
      setCouponApplied(true)
      toast.success(`Coupon applied! ${pct}% off`, { style: { background: '#12121f', color: '#fff', border: '1px solid rgba(0,255,136,0.3)' } })
    } else {
      toast.error('Invalid coupon code', { style: { background: '#12121f', color: '#fff' } })
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const orderNum = 'FS-' + Date.now().toString(36).toUpperCase()
    dispatch(clearCart())
    setLoading(false)
    navigate(`/order-success?order=${orderNum}`)
  }

  if (count === 0 && step < 2) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="font-display text-2xl text-white mb-3">Your bag is empty</h2>
        <p className="text-gray-500 mb-6">Add some items before checking out</p>
        <Link to="/products" className="btn-primary"><span>Shop Now</span></Link>
      </div>
    </div>
  )

  return (
    <>
      <Helmet><title>Checkout | FashionStore</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300
                  ${i === step ? 'text-neon-cyan' : i < step ? 'text-neon-green cursor-pointer' : 'text-gray-600'}`}>
                <span className={`w-6 h-6 flex items-center justify-center border text-xs font-bold transition-all duration-300
                  ${i === step ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : i < step ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-700 text-gray-600'}`}>
                  {i < step ? <FiCheck size={12} /> : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px transition-all duration-500 ${i < step ? 'bg-neon-green' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0 — Address */}
              {step === 0 && (
                <motion.div key="address"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 md:p-8 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                  <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                    <FiMapPin className="text-neon-cyan" size={18} /> Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'full_name',    label: 'Full Name',              col: 2, required: true },
                      { name: 'phone',        label: 'Phone Number',           col: 2, required: true },
                      { name: 'address_line1',label: 'Address Line 1',         col: 2, required: true },
                      { name: 'address_line2',label: 'Address Line 2 (Optional)', col: 2 },
                      { name: 'city',         label: 'City',                   required: true },
                      { name: 'state',        label: 'State',                  required: true },
                      { name: 'pincode',      label: 'Pincode',                required: true },
                      { name: 'country',      label: 'Country' },
                    ].map(({ name, label, col, required }) => (
                      <div key={name} className={col === 2 ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-mono">{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange}
                          required={required} className="input" placeholder={label} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {
                    if (!form.full_name || !form.phone || !form.address_line1 || !form.city || !form.state || !form.pincode) {
                      toast.error('Please fill all required fields', { style: { background: '#12121f', color: '#fff' } })
                      return
                    }
                    setStep(1)
                  }} className="btn-primary mt-6 w-full sm:w-auto">
                    <span className="flex items-center gap-2">Continue to Payment <FiArrowLeft className="rotate-180" size={14} /></span>
                  </button>
                </motion.div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 md:p-8 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                  <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                    <FiCreditCard className="text-neon-cyan" size={18} /> Payment Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      { value: 'cod',      label: 'Cash on Delivery',              sub: 'Pay when your order arrives',         icon: '💵' },
                      { value: 'razorpay', label: 'Razorpay',                      sub: 'Cards, UPI, Net Banking, Wallets',     icon: '💳' },
                      { value: 'stripe',   label: 'Stripe',                        sub: 'International cards accepted',         icon: '🌐' },
                    ].map(({ value, label, sub, icon }) => (
                      <label key={value}
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-300 group
                          ${paymentMethod === value ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/8 hover:border-white/20'}`}>
                        <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                          onChange={() => setPaymentMethod(value)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${paymentMethod === value ? 'border-neon-cyan' : 'border-gray-600'}`}>
                          {paymentMethod === value && <div className="w-2 h-2 rounded-full bg-neon-cyan" />}
                        </div>
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-gray-500">{sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="btn-outline flex-1 sm:flex-none">
                      <span className="flex items-center gap-2"><FiArrowLeft size={14} /> Back</span>
                    </button>
                    <button onClick={() => setStep(2)} className="btn-primary flex-1 sm:flex-none">
                      <span className="flex items-center gap-2">Review Order <FiArrowLeft className="rotate-180" size={14} /></span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Confirm */}
              {step === 2 && (
                <motion.div key="confirm"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4">
                  {/* Address summary */}
                  <div className="glass-card p-5 relative">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2"><FiMapPin size={14} className="text-neon-cyan" /> Delivery Address</h3>
                      <button onClick={() => setStep(0)} className="text-xs text-neon-cyan hover:underline font-mono">Edit</button>
                    </div>
                    <p className="text-sm text-gray-400">{form.full_name} · {form.phone}</p>
                    <p className="text-sm text-gray-500">{form.address_line1}{form.address_line2 ? ', ' + form.address_line2 : ''}</p>
                    <p className="text-sm text-gray-500">{form.city}, {form.state} - {form.pincode}</p>
                  </div>
                  {/* Payment summary */}
                  <div className="glass-card p-5 relative">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2"><FiCreditCard size={14} className="text-neon-cyan" /> Payment</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-neon-cyan hover:underline font-mono">Edit</button>
                    </div>
                    <p className="text-sm text-gray-400 capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
                  </div>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="btn-primary w-full">
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Placing Order...</>
                      ) : (
                        <><FiZap size={16} /> Place Order — ₹{grandTotal.toLocaleString()}</>
                      )}
                    </span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <FiShield size={12} className="text-neon-green" />
                    <span>256-bit SSL encrypted · Secure checkout</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass-card p-5 sticky top-24 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-purple" />
              <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest font-mono">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={item.key} className="flex gap-3">
                    <img src={item.product?.thumbnail} alt="" className="w-12 h-14 object-cover bg-surface-card flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-600 font-mono">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-mono text-white flex-shrink-0">
                      ₹{((item.product?.sale_price || item.product?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              {!couponApplied ? (
                <div className="flex gap-2 mb-4">
                  <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                    placeholder="COUPON CODE" className="input py-2 text-xs flex-1 font-mono tracking-widest" />
                  <button onClick={applyCoupon} className="btn-outline py-2 px-3 text-xs">Apply</button>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4 px-3 py-2 border border-neon-green/30 bg-neon-green/5">
                  <span className="text-xs text-neon-green font-mono">✓ {coupon} applied</span>
                  <button onClick={() => { setCouponApplied(false); setDiscount(0); setCoupon('') }}
                    className="text-xs text-gray-500 hover:text-neon-pink">Remove</button>
                </div>
              )}

              <div className="space-y-2 text-xs border-t border-white/5 pt-4">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-mono text-white">₹{total.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-neon-green"><span>Discount</span><span className="font-mono">-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={`font-mono ${shipping === 0 ? 'text-neon-green' : 'text-white'}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span className="font-mono text-white">₹{tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-sm border-t border-white/5 pt-2 mt-1">
                  <span className="text-white">Total</span>
                  <span className="font-mono text-neon-gold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <FiTruck size={12} className="text-neon-cyan flex-shrink-0" />
                <span>{shipping === 0 ? 'Free shipping applied!' : `₹${(999 - total).toLocaleString()} away from free shipping`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

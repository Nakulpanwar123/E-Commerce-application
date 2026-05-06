import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiZap, FiArrowRight } from 'react-icons/fi'
import { login, register } from '@/store/slices/authSlice'
import ParticleField from '@/components/ui/ParticleField'

export default function AuthPage({ mode = 'login' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })

  const isLogin = mode === 'login'
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const action = isLogin ? login({ email: form.email, password: form.password }) : register(form)
    const result = await dispatch(action)
    if (!result.error) navigate('/')
  }

  const fields = isLogin
    ? [{ name: 'email', label: 'Email', type: 'email', icon: FiMail, placeholder: 'you@example.com' },
       { name: 'password', label: 'Password', type: 'password', icon: FiLock, placeholder: '••••••••' }]
    : [{ name: 'name', label: 'Full Name', type: 'text', icon: FiUser, placeholder: 'John Doe' },
       { name: 'email', label: 'Email', type: 'email', icon: FiMail, placeholder: 'you@example.com' },
       { name: 'password', label: 'Password', type: 'password', icon: FiLock, placeholder: '••••••••' },
       { name: 'password_confirmation', label: 'Confirm Password', type: 'password', icon: FiLock, placeholder: '••••••••' }]

  return (
    <>
      <Helmet><title>{isLogin ? 'Sign In' : 'Create Account'} | FashionStore</title></Helmet>

      <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <ParticleField count={25} />

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop"
            alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
          <div className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative text-center px-12">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
              <div className="w-20 h-20 mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-lg rotate-45 bg-gradient-to-br from-neon-cyan to-neon-purple animate-pulse-neon" />
                <FiZap className="absolute inset-0 m-auto text-white" size={36} />
              </div>
            </motion.div>
            <h2 className="font-display text-5xl font-bold text-white mb-4">
              Fashion<br />
              <span style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Redefined
              </span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              Premium clothing engineered for the future-forward individual.
            </p>
            <div className="flex justify-center gap-6 mt-10">
              {[{ val: '50K+', label: 'Members' }, { val: '10K+', label: 'Products' }, { val: '4.9★', label: 'Rating' }].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="font-mono font-bold text-neon-cyan text-xl">{val}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md">

            <div className="glass-card p-8 md:p-10 relative">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-neon-purple" />

              <div className="mb-8">
                <p className="text-neon-cyan text-xs tracking-widest uppercase font-mono mb-2">
                  {isLogin ? '// Welcome back' : '// New account'}
                </p>
                <h1 className="font-display text-3xl font-bold text-white">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h1>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="border border-neon-pink/30 bg-neon-pink/5 text-neon-pink px-4 py-3 text-sm mb-6 font-mono">
                  // Error: {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-mono">{label}</label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input name={name} type={type} value={form[name]} onChange={handleChange}
                        required={name !== 'phone'}
                        placeholder={placeholder}
                        className="input pl-10" />
                    </div>
                  </div>
                ))}

                {isLogin && (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-xs text-neon-cyan/60 hover:text-neon-cyan transition-colors font-mono">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full mt-2">
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <>{isLogin ? 'Sign In' : 'Create Account'} <FiArrowRight size={16} /></>
                    )}
                  </span>
                </motion.button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6 font-mono">
                {isLogin ? '// No account? ' : '// Have account? '}
                <Link to={isLogin ? '/register' : '/login'}
                  className="text-neon-cyan hover:text-neon-purple transition-colors">
                  {isLogin ? 'Sign up →' : 'Sign in →'}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

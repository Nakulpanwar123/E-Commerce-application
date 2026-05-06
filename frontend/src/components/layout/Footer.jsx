import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiZap } from 'react-icons/fi'

const LINKS = {
  Shop:    [{ l: 'Men',   h: '/category/men' }, { l: 'Women', h: '/category/women' }, { l: 'Kids', h: '/category/kids' }, { l: 'Sale', h: '/sale' }],
  Help:    [{ l: 'FAQ',   h: '/faq' }, { l: 'Shipping', h: '/shipping' }, { l: 'Returns', h: '/returns' }, { l: 'Contact', h: '/contact' }],
  Company: [{ l: 'About', h: '/about' }, { l: 'Blog', h: '/blog' }, { l: 'Careers', h: '/careers' }, { l: 'Privacy', h: '/privacy' }],
}

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #050508 100%)' }}>

      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 relative flex-shrink-0">
                <div className="absolute inset-0 rounded-sm rotate-45 bg-gradient-to-br from-neon-cyan to-neon-purple opacity-80" />
                <FiZap className="absolute inset-0 m-auto text-white" size={14} />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Fashion<span style={{ background: 'linear-gradient(135deg,#00f5ff,#bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Store</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              The future of fashion. Premium clothing engineered for the modern individual.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-gray-600 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ l, h }) => (
                  <li key={h}>
                    <Link to={h} className="text-gray-600 hover:text-gray-300 text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-px bg-neon-cyan group-hover:w-3 transition-all duration-300" />
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-card p-6 md:p-8 mb-10 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-xl font-semibold text-white mb-1">Join the Future</h4>
              <p className="text-gray-500 text-sm">Get exclusive drops, style updates & early access.</p>
            </div>
            <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="flex-1 md:w-72 input border-r-0 text-sm" />
              <button type="submit" className="btn-primary px-6 whitespace-nowrap">
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
          <p className="text-gray-700 text-xs font-mono">
            © {new Date().getFullYear()} FashionStore. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <Link key={t} to="#" className="text-gray-700 hover:text-gray-400 text-xs transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

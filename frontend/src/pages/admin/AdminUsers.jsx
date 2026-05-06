import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX, FiShield, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

const USERS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['Priya Sharma','Rahul Verma','Ananya Singh','Vikram Patel','Sneha Gupta','Arjun Mehta','Kavya Nair','Rohan Das','Meera Joshi','Aditya Kumar'][i % 10],
  email: `user${i + 1}@example.com`,
  role: i === 0 ? 'admin' : 'user',
  orders: Math.floor(Math.random() * 15),
  spent: Math.round(Math.random() * 50000),
  joined: new Date(Date.now() - Math.random() * 365 * 86400000).toLocaleDateString('en-IN'),
  active: Math.random() > 0.1,
}))

export default function AdminUsers() {
  const [users, setUsers]   = useState(USERS)
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRole = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))
    toast.success('Role updated', { style: { background: '#12121f', color: '#fff' } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-xs flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input pl-9 py-2 text-sm w-full" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><FiX size={13} /></button>}
        </div>
        <p className="text-xs text-gray-600 font-mono ml-3">{filtered.length} users</p>
      </div>

      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Role', 'Orders', 'Total Spent', 'Joined', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-gray-600 font-mono uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr key={user.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/3 hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                        style={{ background: user.role === 'admin' ? 'linear-gradient(135deg,#ffd700,#ff8c00)' : 'linear-gradient(135deg,#00f5ff,#bf00ff)' }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium">{user.name}</p>
                        <p className="text-gray-600 text-[10px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleRole(user.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono border capitalize transition-all
                        ${user.role === 'admin' ? 'bg-neon-gold/10 text-neon-gold border-neon-gold/20' : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20'}`}>
                      {user.role === 'admin' ? <FiShield size={10} /> : <FiUser size={10} />}
                      {user.role}
                    </button>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-400">{user.orders}</td>
                  <td className="px-5 py-3 font-mono font-bold text-neon-gold">₹{user.spent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">{user.joined}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono border ${user.active ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

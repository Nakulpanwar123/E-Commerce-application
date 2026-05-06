import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const WISHLIST_KEY = 'fs_wishlist'

function loadWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [] } catch { return [] }
}

export function useWishlist() {
  const user = useSelector(s => s.auth.user)
  const [wishlist, setWishlist] = useState(loadWishlist)

  const toggle = useCallback((productId) => {
    if (!user) {
      toast.error('Please login to save items', {
        style: { background: '#12121f', color: '#fff', border: '1px solid rgba(255,0,110,0.3)' },
      })
      return
    }
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      toast.success(prev.includes(productId) ? 'Removed from wishlist' : '❤️ Added to wishlist', {
        style: { background: '#12121f', color: '#fff', border: '1px solid rgba(0,245,255,0.2)' },
      })
      return next
    })
  }, [user])

  const isWishlisted = (id) => wishlist.includes(id)

  return { wishlist, toggle, isWishlisted }
}

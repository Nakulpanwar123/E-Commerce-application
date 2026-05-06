import { useSelector, useDispatch } from 'react-redux'
import { addItem, updateItem, removeItem, selectCartItems, selectCartCount, selectCartTotal } from '@/store/slices/cartSlice'
import { openCart } from '@/store/slices/uiSlice'
import toast from 'react-hot-toast'

export function useCart() {
  const dispatch = useDispatch()
  const items    = useSelector(selectCartItems)
  const count    = useSelector(selectCartCount)
  const total    = useSelector(selectCartTotal)

  const add = (product, quantity = 1, variantId = null) => {
    dispatch(addItem({ product, variantId, quantity }))
    dispatch(openCart())
    toast.success('Added to bag!', {
      icon: '🛍️',
      style: { background: '#12121f', color: '#fff', border: '1px solid rgba(0,245,255,0.2)' },
    })
  }

  const update = (key, quantity) => dispatch(updateItem({ key, quantity }))
  const remove = (key)           => dispatch(removeItem(key))

  const isInCart    = (productId) => items.some(i => i.product?.id === productId)
  const getCartItem = (productId) => items.find(i => i.product?.id === productId)

  return { items, count, total, add, update, remove, isInCart, getCartItem }
}

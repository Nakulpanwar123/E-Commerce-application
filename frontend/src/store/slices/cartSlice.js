import { createSlice } from '@reduxjs/toolkit'

// ── Persist cart to localStorage ─────────────────────────────────────────────
const CART_KEY = 'fs_cart'

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || [] } catch { return [] }
}
function saveCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)) } catch {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addItem(state, { payload }) {
      const { product, variantId, quantity = 1 } = payload
      const key = `${product.id}-${variantId || 'none'}`
      const idx = state.items.findIndex(i => i.key === key)
      if (idx >= 0) {
        state.items[idx].quantity += quantity
      } else {
        state.items.push({ key, product, variantId: variantId || null, quantity })
      }
      saveCart(state.items)
    },
    updateItem(state, { payload: { key, quantity } }) {
      const idx = state.items.findIndex(i => i.key === key)
      if (idx >= 0) {
        if (quantity <= 0) state.items.splice(idx, 1)
        else state.items[idx].quantity = quantity
      }
      saveCart(state.items)
    },
    removeItem(state, { payload: key }) {
      state.items = state.items.filter(i => i.key !== key)
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart([])
    },
  },
})

export const { addItem, updateItem, removeItem, clearCart } = cartSlice.actions

export const selectCartItems = s => s.cart.items
export const selectCartCount = s => s.cart.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartTotal = s => s.cart.items.reduce((n, i) => {
  const price = i.product?.sale_price || i.product?.price || 0
  return n + price * i.quantity
}, 0)

export default cartSlice.reducer

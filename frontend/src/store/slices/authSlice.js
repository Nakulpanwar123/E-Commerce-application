import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    JSON.parse(localStorage.getItem('fs_user') || 'null'),
    token:   localStorage.getItem('fs_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    loginSuccess(state, { payload }) {
      state.user    = payload.user
      state.token   = payload.token
      state.error   = null
      state.loading = false
      localStorage.setItem('fs_token', payload.token)
      localStorage.setItem('fs_user', JSON.stringify(payload.user))
    },
    logoutUser(state) {
      state.user  = null
      state.token = null
      localStorage.removeItem('fs_token')
      localStorage.removeItem('fs_user')
    },
    setLoading(state, { payload }) { state.loading = payload },
    setError(state, { payload })   { state.error = payload; state.loading = false },
  },
})

export const { loginSuccess, logoutUser, setLoading, setError } = authSlice.actions

// ── Demo credentials ──────────────────────────────────────────────────────────
// Admin:  admin@fashionstore.com / admin123
// User:   user@fashionstore.com  / user123
// Or any email/password works as demo

const DEMO_USERS = {
  'admin@fashionstore.com': { id: 1, name: 'Admin User',  email: 'admin@fashionstore.com', role: 'admin', phone: '+91 9876543210', avatar: null },
  'user@fashionstore.com':  { id: 2, name: 'Demo User',   email: 'user@fashionstore.com',  role: 'user',  phone: '+91 9876543211', avatar: null },
}

export function login(credentials) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    await new Promise(r => setTimeout(r, 700))
    const known = DEMO_USERS[credentials.email]
    const user  = known || {
      id: Date.now(), name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.email.toLowerCase().includes('admin') ? 'admin' : 'user',
      phone: '', avatar: null,
    }
    dispatch(loginSuccess({ user, token: 'demo-' + btoa(user.email) + '-' + Date.now() }))
    return { error: null }
  }
}

export function register(data) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    await new Promise(r => setTimeout(r, 700))
    if (!data.name || !data.email || !data.password) {
      dispatch(setError('All fields are required'))
      return { error: 'All fields required' }
    }
    const user = { id: Date.now(), name: data.name, email: data.email, role: 'user', phone: data.phone || '', avatar: null }
    dispatch(loginSuccess({ user, token: 'demo-' + btoa(user.email) + '-' + Date.now() }))
    return { error: null }
  }
}

export default authSlice.reducer

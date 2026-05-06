import api from './api'

export const productService = {
  list:            (params) => api.get('/products', { params }),
  show:            (slug)   => api.get(`/products/${slug}`),
  featured:        ()       => api.get('/products/featured'),
  trending:        ()       => api.get('/products/trending'),
  getReviews:      (id)     => api.get(`/products/${id}/reviews`),
  submitReview:    (id, d)  => api.post(`/products/${id}/reviews`, d),
}

export const categoryService = {
  list: () => api.get('/categories'),
  show: (slug) => api.get(`/categories/${slug}`),
}

export const orderService = {
  list:          ()         => api.get('/orders'),
  show:          (id)       => api.get(`/orders/${id}`),
  create:        (data)     => api.post('/orders', data),
  verifyPayment: (data)     => api.post('/orders/verify-payment', data),
}

export const wishlistService = {
  list:   ()   => api.get('/wishlist'),
  toggle: (id) => api.post('/wishlist/toggle', { product_id: id }),
}

export const blogService = {
  list: (params) => api.get('/blogs', { params }),
  show: (slug)   => api.get(`/blogs/${slug}`),
}

export const homeService = {
  getData: () => api.get('/home'),
}

export const adminService = {
  stats:         ()         => api.get('/admin/stats'),
  orders:        (params)   => api.get('/admin/orders', { params }),
  updateOrder:   (id, data) => api.put(`/admin/orders/${id}/status`, data),
  createProduct: (data)     => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id)       => api.delete(`/admin/products/${id}`),
}

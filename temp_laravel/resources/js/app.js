import Alpine from 'alpinejs';
import axios from 'axios';

window.Alpine = Alpine;
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.content;

// Cart store
Alpine.store('cart', {
    count: parseInt(localStorage.getItem('cart_count') || '0'),
    items: [],

    async add(productId, variantId, quantity = 1) {
        const res = await axios.post('/cart/add', { product_id: productId, variant_id: variantId, quantity });
        this.count = res.data.cart_count;
        localStorage.setItem('cart_count', this.count);
        Alpine.store('toast').show('Added to cart!', 'success');
    },

    async remove(itemId) {
        const res = await axios.delete(`/cart/${itemId}`);
        this.count = res.data.cart_count;
        localStorage.setItem('cart_count', this.count);
    },
});

// Wishlist store
Alpine.store('wishlist', {
    items: new Set(JSON.parse(localStorage.getItem('wishlist') || '[]')),

    async toggle(productId) {
        const res = await axios.post('/wishlist/toggle', { product_id: productId });
        if (res.data.added) {
            this.items.add(productId);
            Alpine.store('toast').show('Added to wishlist!', 'success');
        } else {
            this.items.delete(productId);
            Alpine.store('toast').show('Removed from wishlist', 'info');
        }
        localStorage.setItem('wishlist', JSON.stringify([...this.items]));
    },

    has(productId) {
        return this.items.has(productId);
    },
});

// Toast notification store
Alpine.store('toast', {
    visible: false,
    message: '',
    type: 'success',

    show(message, type = 'success') {
        this.message = message;
        this.type = type;
        this.visible = true;
        setTimeout(() => this.visible = false, 3000);
    },
});

// Search component
Alpine.data('search', () => ({
    query: '',
    results: [],
    loading: false,
    open: false,
    debounceTimer: null,

    async fetch() {
        if (this.query.length < 2) { this.results = []; return; }
        this.loading = true;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(async () => {
            const res = await axios.get('/search/suggest', { params: { q: this.query } });
            this.results = res.data;
            this.open = true;
            this.loading = false;
        }, 300);
    },
}));

// Product image gallery
Alpine.data('gallery', (images) => ({
    active: 0,
    images,
    zoom: false,

    setActive(index) { this.active = index; },
}));

// Countdown timer for flash sales
Alpine.data('countdown', (endTime) => ({
    hours: '00', minutes: '00', seconds: '00',
    expired: false,

    init() {
        this.tick();
        setInterval(() => this.tick(), 1000);
    },

    tick() {
        const diff = new Date(endTime) - new Date();
        if (diff <= 0) { this.expired = true; return; }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        this.hours   = String(h).padStart(2, '0');
        this.minutes = String(m).padStart(2, '0');
        this.seconds = String(s).padStart(2, '0');
    },
}));

// Outfit builder
Alpine.data('outfitBuilder', () => ({
    selected: { top: null, bottom: null, shoes: null, accessory: null },

    pick(category, product) {
        this.selected[category] = product;
    },

    async save() {
        await axios.post('/outfit/save', { items: this.selected });
        Alpine.store('toast').show('Outfit saved!', 'success');
    },
}));

Alpine.start();

// Intersection Observer for lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                img.classList.remove('skeleton');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => observer.observe(img));
});

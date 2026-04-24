import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from '../bootstrap';
import {
    Link,
    NavLink,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom';

const StorefrontContext = createContext(null);

const currency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

const fetcher = (url) => axios.get(url).then((response) => response.data);

function useStorefront() {
    return useContext(StorefrontContext);
}

function useRemoteData(key, loader) {
    const [state, setState] = useState({ loading: true, data: null, error: null });

    useEffect(() => {
        let active = true;
        setState({ loading: true, data: null, error: null });

        loader()
            .then((data) => {
                if (active) setState({ loading: false, data, error: null });
            })
            .catch((error) => {
                if (active) setState({ loading: false, data: null, error });
            });

        return () => {
            active = false;
        };
    }, [key]);

    return state;
}

function App() {
    const [bootstrap, setBootstrap] = useState(null);
    const [toast, setToast] = useState(null);

    const refreshBootstrap = async () => {
        const data = await fetcher('/storefront-data/bootstrap');
        setBootstrap(data);
    };

    useEffect(() => {
        refreshBootstrap();
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(null), 2800);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const value = useMemo(
        () => ({
            bootstrap,
            refreshBootstrap,
            notify: (message, type = 'success') => setToast({ message, type }),
        }),
        [bootstrap],
    );

    return (
        <StorefrontContext.Provider value={value}>
            <div className="min-h-screen bg-white">
                <Header />
                <main className="min-h-[calc(100vh-220px)]">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/sale" element={<CategoryPage sale />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/size-guide" element={<SizeGuidePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/outfit-builder" element={<OutfitBuilderPage />} />
                        <Route path="/blog" element={<BlogListPage />} />
                        <Route path="/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/p/:slug" element={<ProductPage />} />
                        <Route path="/:slug" element={<CategoryPage />} />
                    </Routes>
                </main>
                <Footer />
                {toast ? <Toast toast={toast} /> : null}
            </div>
        </StorefrontContext.Provider>
    );
}

function Header() {
    const { bootstrap } = useStorefront();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return undefined;
        }

        const timer = window.setTimeout(async () => {
            try {
                const data = await fetcher(`/search/suggest?q=${encodeURIComponent(query.trim())}`);
                setResults(data);
                setOpen(true);
            } catch {
                setResults([]);
            }
        }, 250);

        return () => window.clearTimeout(timer);
    }, [query]);

    const submit = (event) => {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
            <div className="bg-primary-600 px-4 py-2 text-center text-sm text-white">
                {bootstrap?.promo || 'Free shipping on orders over Rs.999'}
            </div>
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="font-display text-2xl font-bold text-primary-600">
                    {bootstrap?.brand || 'FashionStore'}
                </Link>
                <nav className="hidden items-center gap-6 lg:flex">
                    {(bootstrap?.navigation || []).map((item) => (
                        <NavLink
                            key={item.slug}
                            to={item.href}
                            className={({ isActive }) => `nav-link ${isActive ? 'text-primary-600' : ''}`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <NavLink to="/sale" className="font-semibold text-red-500">
                        Sale
                    </NavLink>
                    <NavLink to="/blog" className="nav-link">
                        Blog
                    </NavLink>
                </nav>
                <div className="relative hidden max-w-md flex-1 md:block">
                    <form onSubmit={submit}>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search clothes, brands..."
                            className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </form>
                    {open && results.length > 0 ? (
                        <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                            {results.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => navigate(new URL(item.url).pathname)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                                >
                                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs font-semibold text-primary-600">{currency(item.price)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center gap-2">
                    <NavLink to="/wishlist" className="btn-ghost text-sm">
                        Wishlist {bootstrap?.counts?.wishlist ? `(${bootstrap.counts.wishlist})` : ''}
                    </NavLink>
                    <NavLink to="/cart" className="btn-ghost text-sm">
                        Cart {bootstrap?.counts?.cart ? `(${bootstrap.counts.cart})` : ''}
                    </NavLink>
                    {bootstrap?.auth?.loggedIn ? (
                        <>
                            <a href="/dashboard" className="btn-ghost text-sm">
                                Dashboard
                            </a>
                            {bootstrap?.auth?.user?.isAdmin ? (
                                <a href="/admin" className="btn-ghost text-sm">
                                    Admin
                                </a>
                            ) : null}
                            <form method="POST" action="/logout">
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={document.querySelector('meta[name="csrf-token"]')?.content || ''}
                                />
                                <button type="submit" className="btn-primary px-4 py-2 text-sm">
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <a href="/login" className="btn-primary px-4 py-2 text-sm">
                            Login
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div>
                    <h3 className="font-display text-2xl font-bold text-primary-600">FashionStore</h3>
                    <p className="mt-3 text-sm text-gray-600">
                        A rebuilt Laravel storefront running on Vite + React with the same product, search, cart, and
                        editorial flow.
                    </p>
                </div>
                <FooterLinks title="Shop" links={[['Women', '/women'], ['Men', '/men'], ['Kids', '/kids'], ['Sale', '/sale']]} />
                <FooterLinks title="Explore" links={[['Blog', '/blog'], ['Size Guide', '/size-guide'], ['Cart', '/cart'], ['Wishlist', '/wishlist']]} />
                <FooterLinks title="Account" links={[['Login', '/login'], ['Dashboard', '/dashboard'], ['Profile', '/profile'], ['Checkout', '/checkout']]} />
            </div>
        </footer>
    );
}

function FooterLinks({ title, links }) {
    return (
        <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">{title}</h4>
            <div className="mt-4 space-y-3">
                {links.map(([label, href]) => (
                    <a key={href} href={href} className="block text-sm text-gray-600 hover:text-primary-600">
                        {label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function Toast({ toast }) {
    const bg = toast.type === 'error' ? 'bg-red-500' : 'bg-primary-600';
    return (
        <div className={`fixed right-4 top-4 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-xl ${bg}`}>
            {toast.message}
        </div>
    );
}

function LoadingState({ label = 'Loading storefront...' }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-gray-500">
                {label}
            </div>
        </div>
    );
}

function ErrorState({ message = 'Something went wrong.' }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center text-red-700">{message}</div>
        </div>
    );
}

function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({ product }) {
    const { bootstrap, refreshBootstrap, notify } = useStorefront();
    const navigate = useNavigate();

    const addToCart = async () => {
        await axios.post('/cart/add', {
            product_id: product.id,
            variant_id: product.defaultVariantId,
            quantity: 1,
        });
        await refreshBootstrap();
        notify('Added to cart');
    };

    const toggleWishlist = async () => {
        if (!bootstrap?.auth?.loggedIn) {
            window.location.href = '/login';
            return;
        }
        await axios.post('/wishlist/toggle', { product_id: product.id });
        await refreshBootstrap();
        notify('Wishlist updated');
    };

    return (
        <article className="product-card overflow-hidden">
            <button type="button" onClick={() => navigate(product.href)} className="block w-full text-left">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    {product.discountPercent ? (
                        <span className="badge absolute left-3 top-3 bg-red-500 text-white">-{product.discountPercent}%</span>
                    ) : null}
                    {product.isNew ? <span className="badge absolute right-3 top-3 bg-green-500 text-white">New</span> : null}
                </div>
            </button>
            <div className="space-y-3 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">{product.brand}</p>
                    <button type="button" onClick={() => navigate(product.href)} className="mt-1 text-left font-medium text-gray-900 hover:text-primary-600">
                        {product.name}
                    </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <span className="font-semibold text-gray-900">{currency(product.salePrice)}</span>
                        {product.originalPrice > product.salePrice ? (
                            <span className="ml-2 text-sm text-gray-400 line-through">{currency(product.originalPrice)}</span>
                        ) : null}
                    </div>
                    {product.avgRating ? <span className="text-xs text-gray-500">{product.avgRating.toFixed(1)} / 5</span> : null}
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={addToCart} className="btn-primary flex-1 px-4 py-2 text-sm">
                        Add to cart
                    </button>
                    <button type="button" onClick={toggleWishlist} className="btn-outline px-4 py-2 text-sm">
                        Save
                    </button>
                </div>
            </div>
        </article>
    );
}

function HomePage() {
    const { loading, data, error } = useRemoteData('home', () => fetcher('/storefront-data/home'));

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message="Unable to load the storefront home page." />;

    return (
        <>
            <section className="bg-gray-950 text-white">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
                    <div className="max-w-2xl">
                        <p className="badge bg-primary-500/20 text-primary-200">{data.hero.eyebrow}</p>
                        <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-6xl">{data.hero.title}</h1>
                        <p className="mt-6 max-w-xl text-lg text-gray-300">{data.hero.subtitle}</p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link className="btn-primary" to={data.hero.primaryCta.href}>
                                {data.hero.primaryCta.label}
                            </Link>
                            <Link className="btn-outline border-white text-white hover:bg-white hover:text-gray-900" to={data.hero.secondaryCta.href}>
                                {data.hero.secondaryCta.label}
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {data.categories.map((category) => (
                            <Link key={category.slug} to={`/${category.slug}`} className="overflow-hidden rounded-2xl bg-gray-900">
                                <img src={category.image} alt={category.name} className="aspect-[4/5] w-full object-cover" />
                                <div className="p-4">
                                    <p className="font-semibold">{category.name}</p>
                                    <p className="text-sm text-gray-300">{category.cta}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {data.flashSale ? (
                <Section title={data.flashSale.name} subtitle={`Ends ${new Date(data.flashSale.endsAt).toLocaleString()}`}>
                    <ProductGrid products={data.flashSale.products} />
                </Section>
            ) : null}

            <Section title="New Arrivals" action={<Link className="text-primary-600" to="/new-arrivals">View all</Link>}>
                <ProductGrid products={data.newArrivals} />
            </Section>

            <section className="bg-primary-50 py-16">
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="section-title">Build Your Perfect Outfit</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Mix and match tops, bottoms, shoes and accessories to create your signature look.
                    </p>
                    <Link to="/outfit-builder" className="btn-primary mt-8">
                        Try Outfit Builder
                    </Link>
                </div>
            </section>

            <Section title="Trending Now" action={<Link className="text-primary-600" to="/trending">View all</Link>}>
                <ProductGrid products={data.trendingProducts} />
            </Section>

            <Section title="Style Guides & Tips" action={<Link className="text-primary-600" to="/blog">Read all</Link>}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {data.blogs.map((blog) => (
                        <Link key={blog.id} to={blog.href} className="card block overflow-hidden">
                            <img src={blog.coverImage} alt={blog.title} className="aspect-video w-full object-cover" />
                            <div className="space-y-2 p-5">
                                <span className="badge bg-primary-100 text-primary-700">{blog.category}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                                <p className="text-sm text-gray-500">{blog.excerpt}</p>
                                <p className="text-xs text-gray-400">{blog.publishedAt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Section>

            <Section title="Why shoppers stay with us">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {data.trustBadges.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}

function Section({ title, subtitle, action, children }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                    <h2 className="section-title">{title}</h2>
                    {subtitle ? <p className="mt-2 text-sm text-gray-500">{subtitle}</p> : null}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function CategoryPage({ sale = false }) {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const sort = searchParams.get('sort') || 'newest';
    const key = `${sale ? 'sale' : params.slug}:${sort}`;
    const { loading, data, error } = useRemoteData(key, () =>
        fetcher(sale ? `/storefront-data/sale?sort=${sort}` : `/storefront-data/category/${params.slug}?sort=${sort}`),
    );

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message="Unable to load this collection." />;

    return (
        <Section
            title={data.category.name}
            subtitle={data.category.description || `${data.pagination.total} products available`}
            action={<SortPicker current={sort} />}
        >
            <div className="mb-8 flex flex-wrap gap-2">
                {(data.filters.brands || []).slice(0, 8).map((brand) => (
                    <span key={brand} className="badge bg-gray-100 text-gray-700">
                        {brand}
                    </span>
                ))}
            </div>
            <ProductGrid products={data.products} />
        </Section>
    );
}

function SortPicker({ current }) {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <select
            value={current}
            onChange={(event) => navigate(`${location.pathname}?sort=${event.target.value}`)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
        </select>
    );
}

function ProductPage() {
    const { slug } = useParams();
    const { loading, data, error } = useRemoteData(slug, () => fetcher(`/storefront-data/product/${slug}`));
    const { refreshBootstrap, notify } = useStorefront();
    const [variantId, setVariantId] = useState(null);

    useEffect(() => {
        setVariantId(data?.product?.defaultVariantId || null);
    }, [data]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message="Unable to load this product." />;

    const addToCart = async () => {
        await axios.post('/cart/add', {
            product_id: data.product.id,
            variant_id: variantId,
            quantity: 1,
        });
        await refreshBootstrap();
        notify('Added to cart');
    };

    return (
        <>
            <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
                <div className="space-y-4">
                    <img
                        src={data.product.images[0]?.url || data.product.image}
                        alt={data.product.name}
                        className="aspect-[4/5] w-full rounded-2xl bg-gray-100 object-cover"
                    />
                    <div className="grid grid-cols-4 gap-4">
                        {data.product.images.map((image) => (
                            <img key={image.id} src={image.url} alt="" className="aspect-square rounded-xl bg-gray-100 object-cover" />
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-sm uppercase tracking-wide text-primary-600">{data.product.brand}</p>
                        <h1 className="mt-2 font-display text-4xl font-bold text-gray-900">{data.product.name}</h1>
                        <p className="mt-4 text-gray-600">{data.product.description}</p>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-gray-900">{currency(data.product.salePrice)}</span>
                        {data.product.originalPrice > data.product.salePrice ? (
                            <span className="text-lg text-gray-400 line-through">{currency(data.product.originalPrice)}</span>
                        ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Rating</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                                {data.product.avgRating || 0} / 5 ({data.product.reviewsCount} reviews)
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Stock</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">{data.product.stock} units available</p>
                        </div>
                    </div>
                    {data.product.variants.length ? (
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-gray-700">Choose variant</span>
                            <select
                                value={variantId || ''}
                                onChange={(event) => setVariantId(Number(event.target.value))}
                                className="input-field"
                            >
                                {data.product.variants.map((variant) => (
                                    <option key={variant.id} value={variant.id}>
                                        {[variant.size, variant.color].filter(Boolean).join(' / ') || `Variant ${variant.id}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={addToCart} className="btn-primary">
                            Add to cart
                        </button>
                        <Link to={`/search?q=${encodeURIComponent(data.product.brand)}`} className="btn-outline">
                            More from {data.product.brand}
                        </Link>
                    </div>
                </div>
            </section>

            <Section title="Related Products">
                <ProductGrid products={data.relatedProducts} />
            </Section>
        </>
    );
}

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { loading, data, error } = useRemoteData(query, () => fetcher(`/storefront-data/search?q=${encodeURIComponent(query)}`));

    if (loading) return <LoadingState label="Searching products..." />;
    if (error) return <ErrorState message="Search is unavailable right now." />;

    return (
        <Section title={`Results for "${data.query}"`} subtitle={`${data.pagination.total} matching products`}>
            <ProductGrid products={data.products} />
        </Section>
    );
}

function CartPage() {
    const { refreshBootstrap, notify } = useStorefront();
    const [version, setVersion] = useState(0);
    const { loading, data, error } = useRemoteData(version, () => fetcher('/storefront-data/cart'));

    const refresh = async () => {
        setVersion((value) => value + 1);
        await refreshBootstrap();
    };

    const updateQuantity = async (id, quantity) => {
        await axios.patch(`/cart/${id}`, { quantity });
        await refresh();
        notify('Cart updated');
    };

    const removeItem = async (id) => {
        await axios.delete(`/cart/${id}`);
        await refresh();
        notify('Item removed');
    };

    if (loading) return <LoadingState label="Loading cart..." />;
    if (error) return <ErrorState message="Unable to load your cart." />;

    return (
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            <div className="space-y-4">
                <h1 className="section-title">Shopping Cart</h1>
                {data.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
                        Your cart is empty.
                    </div>
                ) : (
                    data.items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center">
                            <img src={item.product.image} alt={item.product.name} className="h-28 w-24 rounded-xl object-cover" />
                            <div className="flex-1">
                                <Link to={item.product.href} className="font-semibold text-gray-900 hover:text-primary-600">
                                    {item.product.name}
                                </Link>
                                <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                                {item.variant ? (
                                    <p className="mt-1 text-xs text-gray-400">
                                        {[item.variant.size, item.variant.color].filter(Boolean).join(' / ')}
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={item.quantity}
                                    onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                >
                                    {[1, 2, 3, 4, 5].map((count) => (
                                        <option key={count} value={count}>
                                            Qty {count}
                                        </option>
                                    ))}
                                </select>
                                <span className="w-24 text-right font-semibold text-gray-900">
                                    {currency(item.product.salePrice * item.quantity)}
                                </span>
                                <button type="button" onClick={() => removeItem(item.id)} className="btn-ghost text-sm">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <aside className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
                <SummaryRow label="Subtotal" value={currency(data.totals.subtotal)} />
                <SummaryRow label="Discount" value={currency(data.totals.discount)} />
                <SummaryRow label="Shipping" value={currency(data.totals.shipping)} />
                <SummaryRow label="Tax" value={currency(data.totals.tax)} />
                <SummaryRow label="Total" value={currency(data.totals.total)} strong />
                <a href="/checkout" className="btn-primary mt-6 w-full">
                    Continue to Checkout
                </a>
            </aside>
        </section>
    );
}

function SummaryRow({ label, value, strong = false }) {
    return (
        <div className={`mt-4 flex items-center justify-between ${strong ? 'border-t border-gray-200 pt-4 text-lg font-semibold' : 'text-sm text-gray-600'}`}>
            <span>{label}</span>
            <span className={strong ? 'text-gray-900' : ''}>{value}</span>
        </div>
    );
}

function WishlistPage() {
    const { loading, data, error } = useRemoteData('wishlist', () => fetcher('/storefront-data/wishlist'));

    if (loading) return <LoadingState label="Loading wishlist..." />;
    if (error) {
        return (
            <ErrorState message="Please sign in to view your wishlist. Use the Login button above and open this page again." />
        );
    }

    return (
        <Section title="Saved Items" subtitle={`${data.items.length} products`}>
            <ProductGrid products={data.items} />
        </Section>
    );
}

function OutfitBuilderPage() {
    const { loading, data, error } = useRemoteData('outfit-builder', () => fetcher('/storefront-data/outfit-builder'));
    const { notify } = useStorefront();
    const [selection, setSelection] = useState({});

    if (loading) return <LoadingState label="Loading outfit builder..." />;
    if (error) return <ErrorState message="Please sign in to use the outfit builder." />;

    const pick = (slot, product) => {
        setSelection((current) => ({ ...current, [slot]: product }));
    };

    const save = async () => {
        const payload = Object.fromEntries(Object.entries(selection).map(([key, product]) => [key, product?.id || null]));
        await axios.post('/outfit/save', { items: payload });
        notify('Outfit saved');
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <h1 className="section-title">Outfit Builder</h1>
                    <p className="mt-2 text-gray-500">Pick one item from each category and save a complete look.</p>
                </div>
                <button type="button" onClick={save} className="btn-primary">
                    Save outfit
                </button>
            </div>
            <div className="space-y-12">
                {Object.entries(data.categories).map(([slot, products]) => (
                    <div key={slot}>
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold capitalize text-gray-900">{slot}</h2>
                            <span className="text-sm text-gray-500">
                                {selection[slot] ? `Selected: ${selection[slot].name}` : 'Choose one'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => pick(slot, product)}
                                    className={`overflow-hidden rounded-2xl border text-left transition ${selection[slot]?.id === product.id ? 'border-primary-600 shadow-lg' : 'border-gray-100 bg-white shadow-sm'}`}
                                >
                                    <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                                    <div className="space-y-1 p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-400">{product.brand}</p>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm font-semibold text-primary-600">{currency(product.salePrice)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function BlogListPage() {
    const { loading, data, error } = useRemoteData('blogs', () => fetcher('/storefront-data/blogs'));

    if (loading) return <LoadingState label="Loading stories..." />;
    if (error) return <ErrorState message="Unable to load the blog." />;

    return (
        <Section title="Style Guides & Journal" subtitle="Editorial stories, trend notes, and shopping insight.">
            <div className="grid gap-6 lg:grid-cols-3">
                {data.blogs.map((blog) => (
                    <Link key={blog.id} to={blog.href} className="card block overflow-hidden">
                        <img src={blog.coverImage} alt={blog.title} className="aspect-video w-full object-cover" />
                        <div className="space-y-2 p-5">
                            <span className="badge bg-primary-100 text-primary-700">{blog.category}</span>
                            <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                            <p className="text-sm text-gray-500">{blog.excerpt}</p>
                            <p className="text-xs text-gray-400">{blog.publishedAt}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </Section>
    );
}

function BlogPostPage() {
    const { slug } = useParams();
    const { loading, data, error } = useRemoteData(slug, () => fetcher(`/storefront-data/blogs/${slug}`));

    if (loading) return <LoadingState label="Loading article..." />;
    if (error) return <ErrorState message="Unable to load this article." />;

    return (
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-wide text-primary-600">{data.blog.category}</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-gray-900">{data.blog.title}</h1>
            <p className="mt-4 text-sm text-gray-500">
                {data.blog.publishedAt} {data.blog.author ? `| ${data.blog.author}` : ''}
            </p>
            <img src={data.blog.coverImage} alt={data.blog.title} className="mt-10 aspect-video w-full rounded-2xl object-cover" />
            <div
                className="prose prose-lg mt-10 max-w-none"
                dangerouslySetInnerHTML={{ __html: data.blog.body || `<p>${data.blog.excerpt}</p>` }}
            />
        </article>
    );
}

function SizeGuidePage() {
    const rows = [
        ['S', '36', '28'],
        ['M', '38', '30'],
        ['L', '40', '32'],
        ['XL', '42', '34'],
    ];

    return (
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="section-title">Size Guide</h1>
            <p className="mt-4 text-gray-600">A quick reference for the most common fits across tops and bottoms.</p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Size</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Chest</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Waist</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.map((row) => (
                            <tr key={row[0]}>
                                {row.map((cell) => (
                                    <td key={cell} className="px-4 py-3 text-sm text-gray-700">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default App;

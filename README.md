<<<<<<< HEAD
# E-Commerce-application
code for demo 
=======
<<<<<<< HEAD
# FashionStore – Laravel E-Commerce Platform

A high-performance, SEO-optimized fashion e-commerce platform built with Laravel 10+, Tailwind CSS, and Alpine.js.

---

## 🚀 Quick Start

### Requirements
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL 8+
- Redis

### Installation

```bash
# 1. Install PHP dependencies
composer install

# 2. Install Node dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Generate app key
php artisan key:generate

# 5. Configure .env (DB, Redis, AWS, Razorpay, etc.)

# 6. Run migrations
php artisan migrate

# 7. Seed initial data (roles, categories)
php artisan db:seed

# 8. Build assets
npm run build

# 9. Start server
php artisan serve
```

---

## 📁 Project Structure

```
app/
├── Http/Controllers/
│   ├── Admin/          # Admin panel controllers
│   ├── Auth/           # Authentication
│   └── ...             # Frontend controllers
├── Models/             # Eloquent models
├── Services/           # Business logic (Payment, Image, Invoice, Recommendation)
└── Providers/

resources/views/
├── layouts/            # app.blade.php, admin.blade.php
│   └── partials/       # header, footer
├── pages/              # home, category, product, cart, checkout, blog, dashboard
├── admin/              # Admin panel views
├── auth/               # login, register
├── components/         # product-card
├── pdf/                # invoice
└── seo/                # robots.txt

routes/
├── web.php             # All web routes
└── api.php             # API routes

database/migrations/    # Single migration file with all tables
```

---

## ⚙️ Key Features

| Feature | Implementation |
|---|---|
| SEO | Dynamic meta, JSON-LD schema, sitemap.xml, robots.txt, canonical URLs |
| Performance | Redis caching, lazy loading images, WebP conversion, CDN-ready |
| Payments | Razorpay + Stripe + Cash on Delivery |
| Search | Live search with debounce (Meilisearch-ready) |
| Admin | Dashboard with charts, product/order/coupon/blog management |
| Security | CSRF, XSS, SQL injection protection, role-based access (Spatie) |
| Images | Auto WebP conversion, S3 upload, responsive srcset |
| PDF | Auto invoice generation with DomPDF |
| Outfit Builder | Mix & match clothing items |

---

## 🔐 Admin Access

After seeding, visit `/admin` with an account that has the `admin` role.

To assign admin role:
```bash
php artisan tinker
# User::first()->assignRole('admin');
```

---

## 🌐 Deployment (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/fashionstore/public;
    index index.php;

    location / { try_files $uri $uri/ /index.php?$query_string; }
    location ~ \.php$ { fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; include fastcgi_params; fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; }
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|woff2)$ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

---

## 📦 CSV Import Format

For bulk product upload, use this CSV format:
```
name,brand,category,description,original_price,sale_price,stock
Black Oversized Tee,H&M,men/t-shirts,Premium cotton tee,999,699,50
```
=======
# E-Commerce-application
code for demo 
>>>>>>> d355a62f93fcdc10bff6b73464635edb74c900bc
>>>>>>> 5e6748f (first)

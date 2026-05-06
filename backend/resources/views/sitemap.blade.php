<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://fashionstore.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
    <url><loc>https://fashionstore.com/blog</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>

    @foreach($categories as $cat)
    <url>
        <loc>https://fashionstore.com/category/{{ $cat->slug }}</loc>
        <lastmod>{{ $cat->updated_at->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

    @foreach($products as $product)
    <url>
        <loc>https://fashionstore.com/products/{{ $product->slug }}</loc>
        <lastmod>{{ $product->updated_at->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    @endforeach

    @foreach($blogs as $blog)
    <url>
        <loc>https://fashionstore.com/blog/{{ $blog->slug }}</loc>
        <lastmod>{{ $blog->updated_at->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    @endforeach
</urlset>

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function __construct(private ImageService $imageService) {}

    public function index(Request $request)
    {
        $products = Product::with(['category', 'images'])
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->category, fn($q, $c) => $q->where('category_id', $c))
            ->latest()->paginate(20);

        $categories = Category::active()->get();
        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::active()->get();
        return view('admin.products.form', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'brand'            => 'required|string|max:100',
            'category_id'      => 'required|exists:categories,id',
            'description'      => 'required|string',
            'original_price'   => 'required|numeric|min:0',
            'sale_price'       => 'required|numeric|min:0',
            'stock'            => 'required|integer|min:0',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'images.*'         => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $data['sku']  = strtoupper(Str::random(8));

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $uploaded = $this->imageService->upload($file, 'products');
                $product->images()->create(['url' => $uploaded['url'], 'sort_order' => $i]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::active()->get();
        $product->load(['images', 'variants']);
        return view('admin.products.form', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'brand'          => 'required|string|max:100',
            'category_id'    => 'required|exists:categories,id',
            'description'    => 'required|string',
            'original_price' => 'required|numeric|min:0',
            'sale_price'     => 'required|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'is_active'      => 'boolean',
            'is_featured'    => 'boolean',
        ]);

        $product->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $uploaded = $this->imageService->upload($file, 'products');
                $product->images()->create(['url' => $uploaded['url'], 'sort_order' => $product->images->count() + $i]);
            }
        }

        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    public function bulkUpload(Request $request)
    {
        $request->validate(['csv' => 'required|file|mimes:csv,txt']);

        $rows = array_map('str_getcsv', file($request->file('csv')->getRealPath()));
        $headers = array_shift($rows);

        $created = 0;
        foreach ($rows as $row) {
            $data = array_combine($headers, $row);
            $category = Category::firstOrCreate(['name' => $data['category']], ['slug' => Str::slug($data['category'])]);

            Product::create([
                'name'           => $data['name'],
                'slug'           => Str::slug($data['name']) . '-' . uniqid(),
                'sku'            => strtoupper(Str::random(8)),
                'brand'          => $data['brand'],
                'category_id'    => $category->id,
                'description'    => $data['description'] ?? '',
                'original_price' => $data['original_price'],
                'sale_price'     => $data['sale_price'],
                'stock'          => $data['stock'] ?? 0,
                'is_active'      => true,
            ]);
            $created++;
        }

        return back()->with('success', "{$created} products imported successfully.");
    }
}

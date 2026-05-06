export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="shimmer aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-2 w-1/3 rounded" />
        <div className="shimmer h-3 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`shimmer h-3 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return <div className="shimmer h-[85vh] w-full" />
}

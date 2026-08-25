'use client'
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types/ProductItem';

function AnimatedCard({ prod, index }: { prod: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      style={{ animationDelay: `${(index % 8) * 50}ms`, animationFillMode: 'backwards' }}
    >
      <ProductCard prod={prod} />
    </div>
  );
}

export default function ProductsGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return <p className="text-center py-10 text-gray-500">No products found</p>;
  }

  return (
    <div className="grid grid-cols-1 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((prod, index) => (
        <AnimatedCard key={prod._id} prod={prod} index={index} />
      ))}
    </div>
  );
}
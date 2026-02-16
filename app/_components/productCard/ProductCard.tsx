import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "../../types/ProductItem";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/app/button/button";
import WishlistButton from "../wishlist/WishlistButton";
import { Star } from "lucide-react";

export function ProductCard({ prod }: { prod: Product }) {
  const fullStars = Math.floor(prod.ratingsAverage);
  const hasHalfStar = prod.ratingsAverage % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Card className="group relative mx-auto w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/20">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <WishlistButton productId={prod._id} size="md" />
      </div>

      <Link href={`/ProductDetails/${prod._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            width={500}
            height={500}
            src={prod.imageCover}
            alt={prod.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <CardHeader className="space-y-3 p-4">
          {/* Brand Badge */}
          <CardAction>
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
            >
              {prod.brand.name}
            </Badge>
          </CardAction>

          {/* Product Title */}
          <CardTitle className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary dark:text-gray-100">
            {prod.title.split(" ").slice(0, 2).join(" ")}
          </CardTitle>

          <CardDescription className="space-y-2">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {prod.price}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                EGP
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {/* Full Stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                  <Star
                    key={`full-${i}`}
                    className="h-4 w-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500"
                  />
                ))}
                
                {/* Half Star */}
                {hasHalfStar && (
                  <div className="relative">
                    <Star className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
                    </div>
                  </div>
                )}
                
                {/* Empty Stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                  <Star
                    key={`empty-${i}`}
                    className="h-4 w-4 text-gray-300 dark:text-gray-600"
                  />
                ))}
              </div>
              
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {prod.ratingsAverage.toFixed(1)}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
      </Link>

      {/* Add to Cart Button */}
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={prod._id} />
      </CardFooter>
    </Card>
  );
}
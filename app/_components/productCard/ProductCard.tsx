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

export function ProductCard({ prod }: { prod: Product }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <Link href={`/ProductDetails/${prod._id}`}>
        <Image
          width={500}
          height={500}
          src={prod.imageCover}
          alt={prod.title}
          className="w-full"
        />
        <CardHeader className="mt-5">
          <CardAction>
            <Badge variant="secondary">{prod.brand.name}</Badge>
          </CardAction>
          <CardTitle>{prod.title.split(" ").slice(0, 2).join(" ")}</CardTitle>
          <CardDescription>
            <div className="">
              <span>price : {prod.price} EGP</span>
              <div className="flex items-center gap-1">
                <span>Rate : {prod.ratingsAverage} </span>
                <div className="text-amber-500 text-2xl">
                  {"★".repeat(Math.round(prod.ratingsAverage))}
                  {"☆".repeat(5 - Math.round(prod.ratingsAverage))}
                </div>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Link>
      <AddToCartButton product={prod._id}/>
    </Card>
  );
}

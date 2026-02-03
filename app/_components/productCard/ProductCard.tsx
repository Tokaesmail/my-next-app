import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <CardFooter className="flex justify-between">
        <Button className="w-auto">Add card</Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </CardFooter>
    </Card>
  );
}

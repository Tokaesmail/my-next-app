import React from 'react'
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
import { Product } from "../../productItem/ProductItem";
import Image from 'next/image';


type MyProps = {
  params: {
    id: string
  }
}

export default async function ProductDetails(props: MyProps) {
  console.log(props);
  let {id} =await props.params;
  console.log(id);

  let response=await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`,{
    cache: 'no-store'
  });
  let {data:SingleProduct}:{data:Product}=await response.json();

  console.log(SingleProduct);
  
  return (
    <>
      <div className="container max-w-7xl mx-auto my-10 px-4 grid md:grid-cols-3 gap-8 items-start">
  <div className="flex justify-center md:justify-start">
    <Image
      width={500}
      height={500}
       alt="logo"
      src={SingleProduct.imageCover}
      className="w-3/4 md:w-full rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
    />
  </div>

  <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
    <CardHeader className="space-y-3">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-lg">
          {SingleProduct.brand.name}
        </Badge>
        <span className="text-sm text-gray-500">{SingleProduct.category.slug}</span>
      </div>

      <CardTitle className="text-2xl font-bold text-sky-600">
        {SingleProduct.title}
      </CardTitle>

      <CardDescription className="text-gray-600 leading-relaxed">
        {SingleProduct.description}
      </CardDescription>

      <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm mt-4">
        <p><strong>Category:</strong> {SingleProduct.category.name}</p>
        <p><strong>Created:</strong> {new Date(SingleProduct.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated:</strong> {new Date(SingleProduct.updatedAt).toLocaleDateString()}</p>
        <p><strong>Sold:</strong> {SingleProduct.sold}</p>
        <p><strong>Ratings:</strong> {SingleProduct.ratingsQuantity}</p>
        <p><strong>Price after discount:</strong> {SingleProduct.priceAfterDiscount || SingleProduct.price} EGP</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-lg font-semibold">{SingleProduct.ratingsAverage}</span>
        <div className="text-amber-400 text-xl">
          {'★'.repeat(Math.round(SingleProduct.ratingsAverage))}
          {'☆'.repeat(5 - Math.round(SingleProduct.ratingsAverage))}
        </div>
      </div>
    </CardHeader>

    <CardFooter className="flex justify-center mt-6">
      <Button className="w-full md:w-1/2 bg-sky-500 hover:bg-sky-600 text-white text-lg py-2 rounded-lg">
        Add to Cart
      </Button>
    </CardFooter>
  </div>
      </div>

    </>
  )
}

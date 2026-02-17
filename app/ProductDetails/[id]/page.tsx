import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Product } from "../../types/ProductItem";
import Image from "next/image";
import AddToCartButton from "@/app/button/button";

type MyProps = {
  params: {
    id: string;
  };
};

export default async function ProductDetails(props: MyProps) {
  let { id } = await props.params;

  let response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    { cache: "no-store" }
  );
  let { data: SingleProduct }: { data: Product } = await response.json();

  return (
    // الخلفية الأساسية للصفحة
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f1a] transition-colors duration-300 py-10">
      <div className="container max-w-7xl mx-auto px-4">
        
        {/* الحاوية الكبيرة التي تجمع كل شيء (قطعة واحدة) */}
        <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          
          {/* قسم الصورة مع البوردر الأسود */}
          <div className="md:w-1/3 flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-800/20">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-transparent dark:border-black shadow-inner">
              <Image
                width={600}
                height={600}
                alt={SingleProduct.title}
                src={SingleProduct.imageCover}
                className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-110"
                priority
              />
            </div>
          </div>

          {/* قسم البيانات */}
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
            <CardHeader className="p-0 space-y-6">
              
              <div className="flex justify-between items-center">
                <Badge className="bg-green-600 dark:bg-green-700 text-white border-none px-4 py-1 rounded-lg">
                  {SingleProduct.brand.name}
                </Badge>
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {SingleProduct.category.name}
                </span>
              </div>

              <CardTitle className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                {SingleProduct.title}
              </CardTitle>

              {/* الخط العمودي الأخضر بجانب الكلام (الذي طلبتيه) */}
              <div className="relative pl-6 py-2">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic">
                  {SingleProduct.description}
                </CardDescription>
              </div>

              {/* تفاصيل إضافية */}
              <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100 dark:border-gray-800/50">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-black">Rating Average</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black dark:text-white">{SingleProduct.ratingsAverage}</span>
                    <div className="flex text-amber-400 text-sm">
                       {"★".repeat(Math.floor(SingleProduct.ratingsAverage))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-black">Stock Status</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">Available</p>
                </div>
              </div>

              {/* السعر وزر الإضافة */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-bold">Best Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">
                      {SingleProduct.priceAfterDiscount || SingleProduct.price}
                    </span>
                    <span className="text-lg font-bold text-green-600">EGP</span>
                  </div>
                </div>
                
                <div className="flex-1 max-w-sm">
                  <AddToCartButton product={SingleProduct._id} />
                </div>
              </div>

            </CardHeader>
          </div>
        </div>
        
      </div>
    </div>
  );
}
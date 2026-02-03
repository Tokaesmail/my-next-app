import { Button } from "@/components/ui/button";
import { ProductCard } from "./_components/productCard/ProductCard";
import { Product } from "./types/ProductItem";

export default async function Home() {
  let response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products`,
    {
      method: "GET",
      cache: "no-cache",
      next: { revalidate: 60 },
    },
  );
  let { data: allproducts }: { data: Product[] } = await response.json();
  console.log(allproducts);
  return (
    <>
      <div className="grid grid-cols-1 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {allproducts.map((prod) => (
          <ProductCard key={prod._id} prod={prod} />
        ))}
      </div>
    </>
  );
}

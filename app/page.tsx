import CategoriesSlider from "./_components/CategoriesSlider/CategoriesSlider";
import MainSlider from "./_components/MainSlider/MainSlider";
import ProductsGrid from "./_components/productCard/ProductsGrid";
import { Product } from "./types/ProductItem";

export default async function Home() {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products`,
    {
      method: "GET",
      next: { revalidate: 60 },
    },
  );

  const { data: allproducts }: { data: Product[] } = await response.json();

  return (
    <>
      <MainSlider />
      <CategoriesSlider />
      <ProductsGrid products={allproducts} />
    </>
  );
}
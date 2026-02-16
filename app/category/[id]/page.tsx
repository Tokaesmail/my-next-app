import Image from 'next/image';
import Link from 'next/link';
import SubCategoryFilter from './SubcategoryFilter';
import AddToCartButton from "@/app/button/button";

export default async function categoriesId({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ subcategory?: string }>; 
}) {
  const { id: ID } = await params;
  const { subcategory: selectedSubCategory } = await searchParams; 

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${ID}`,
    {
      next: { revalidate: 60 }
    }
  );

  if (!response.ok) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Category Not Found!</p>
          <Link
            href="/category"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            ← Back To Category
          </Link>
        </div>
      </div>
    );
  }

  const { data: category } = await response.json();

  const subCategoriesRes = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${ID}/subcategories`,
    { next: { revalidate: 60 } }
  );

  let subCategories: any[] = [];
  if (subCategoriesRes.ok) {
    const subCategoriesData = await subCategoriesRes.json();
    subCategories = subCategoriesData.data || [];
  }

  const productResponse = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products?category=${ID}`,
    {
      next: { revalidate: 60 }
    }
  );

  let allProducts: any[] = []; 
  if (productResponse.ok) {
    const productsData = await productResponse.json();
    allProducts = productsData.data || [];
  }

  const products = selectedSubCategory
    ? allProducts.filter((product) =>
        product.subcategory?.some((sub: any) => sub._id === selectedSubCategory)
      )
    : allProducts;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Breadcrumbs Navigation */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/category" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Category
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-linear-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-950 border-b dark:border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl ring-4 ring-green-100 dark:ring-green-900/30 transition-all">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                  {category.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  Explore our collection of {category.name}
                </p>
                <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {allProducts.length} Products
                  </span>
                  <span className="text-green-600 dark:text-green-500 font-semibold">#{category.slug}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SubCategory Filters Component (Already updated in previous step) */}
        {subCategories.length > 0 && (
          <SubCategoryFilter
            subCategories={subCategories}
            allProducts={allProducts}
            selectedSubCategory={selectedSubCategory}
            categoryId={ID}
          />
        )}

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {selectedSubCategory
                ? subCategories.find((s: any) => s._id === selectedSubCategory)?.name || 'Filtered Products'
                : 'All Products'}
            </h2>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full border border-transparent dark:border-gray-800"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    {product.priceAfterDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col grow">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors min-h-12">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600 dark:text-green-500">
                          {product.priceAfterDiscount || product.price} EGP
                        </span>
                        {product.priceAfterDiscount && (
                          <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                            {product.price}
                          </span>
                        )}
                      </div>

                      {product.ratingsAverage && (
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {product.ratingsAverage}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      <AddToCartButton product={product._id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
              <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">No products in this filter</p>
              <Link
                href={`/category/${ID}`}
                className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Show All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
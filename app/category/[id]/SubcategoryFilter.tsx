'use client';

import { useRouter, usePathname } from 'next/navigation';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

interface Product {
  subcategory: SubCategory[];
}

interface Props {
  subCategories: SubCategory[];
  allProducts: Product[];
  selectedSubCategory?: string;
  categoryId: string;
}

export default function SubCategoryFilter({
  subCategories,
  allProducts,
  selectedSubCategory,
  categoryId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (subCategoryId: string | null) => {
    if (subCategoryId) {
      router.push(`${pathname}?subcategory=${subCategoryId}`);
    } else {
      router.push(pathname);
    }
  };

  return (
    // bg-white -> dark:bg-gray-900 | border-b -> dark:border-gray-800
    <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 whitespace-nowrap">
            Filter by:
          </span>

          {/* All Button */}
          <button
            onClick={() => handleFilterChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              !selectedSubCategory
                ? 'bg-green-600 text-white shadow-md'
                // bg-gray-100 -> dark:bg-gray-800 | text-gray-700 -> dark:text-gray-300
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All ({allProducts.length})
          </button>

          {/* SubCategory Buttons */}
          {subCategories.map((subCat) => {
            const count = allProducts.filter((product) =>
              product.subcategory?.some((sub) => sub._id === subCat._id)
            ).length;

            return (
              <button
                key={subCat._id}
                onClick={() => handleFilterChange(subCat._id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedSubCategory === subCat._id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {subCat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
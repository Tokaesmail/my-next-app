import Link from 'next/link';
import { fetchBrands } from '../apiBrand/ApiBrand';
import BrandsFilter from './BrandsFilter';

export default async function BrandsPage() {
  const brands = await fetchBrands();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-green-900/20 dark:via-gray-900 dark:to-blue-900/20 border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Partner Brands
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover quality products from our trusted brand partners. We've partnered with
            leading brands to bring you the best selection of fresh and organic products.
          </p>
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Brands</h2>
        <BrandsFilter brands={brands} />
      </div>

      {/* Brand Partner CTA */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 mt-12 border-t dark:border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Want to become a brand partner?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join our growing family of quality brands. Showcase your products to our engaged
                customer base and grow your business with FreshCart.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Access to over 1 million active customers',
                  'Dedicated account manager for your brand',
                  'Marketing and promotional opportunities',
                  'Streamlined logistics and fulfillment',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="inline-block px-8 py-3 bg-green-600 dark:bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Apply to Become a Partner
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-4/3 bg-linear-to-br from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-6xl">🤝</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">Partner With Us</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
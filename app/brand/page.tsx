import Link from 'next/link';
import { fetchBrands } from '../apiBrand/ApiBrand';
import BrandsFilter from './BrandsFilter';

export default async function BrandsPage() {
  const brands = await fetchBrands();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-green-50 via-white to-blue-50 border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Partner Brands
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover quality products from our trusted brand partners. We've partnered with
            leading brands to bring you the best selection of fresh and organic products.
          </p>
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Brands</h2>

        <BrandsFilter brands={brands} />

        {/* Pagination */}
        
      </div>

      {/* Brand Partner CTA */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 mt-12">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Want to become a brand partner?
              </h2>
              <p className="text-gray-600 mb-6">
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
                      className="w-6 h-6 text-green-600 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Apply to Become a Partner
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-4/3 bg-linear-to-br from-green-200 to-blue-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-6xl">🤝</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">Partner With Us</p>
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
'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '../apiBrand/ApiBrand';

interface BrandsFilterProps {
  brands: Brand[];
}

export default function BrandsFilter({ brands }: BrandsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('az');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const filteredAndSortedBrands = () => {
    let filtered = [...brands];

    if (searchQuery) {
      filtered = filtered.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const allFilteredBrands = filteredAndSortedBrands();
  const totalPages = Math.ceil(allFilteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBrands = allFilteredBrands.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="relative w-full md:w-96">
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            placeholder="Search brands..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="az">Alphabetical: A-Z</option>
            <option value="za">Alphabetical: Z-A</option>
            <option value="most">Most Products</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {displayedBrands.length} of {allFilteredBrands.length} brands
      </div>

      {/* All Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {displayedBrands.length > 0 ? (
          displayedBrands.map((brand) => (
            <div
              key={brand._id}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent dark:border-gray-700 hover:dark:border-green-500"
            >
              <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                <Image 
                  width={96} 
                  height={96} 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 text-center">{brand.name}</h3>
              <div className="flex items-center justify-center mt-3">
                <Link
                  href={`/brand/${brand._id}`} 
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm transition-colors"
                >
                  View Products →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No brands found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              currentPage === 1
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
              return <span key={pageNumber} className="text-gray-500">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
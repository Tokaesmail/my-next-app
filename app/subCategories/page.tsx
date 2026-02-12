import React from 'react'

export default async function SubCategory() {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/subcategories', {
        method: "GET",
        next: { revalidate: 60 }
    })

    if (!response.ok) {
        throw new Error("failed to fetch SubCategory")
    }

    const { data: subCategories } = await response.json()

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6 italic">Sub Categories</h2>
            
            <div className="flex flex-wrap gap-3">
                {subCategories.map((sub: any) => (
                    <div 
                        key={sub._id} 
                        className="px-4 py-2 border border-green-600 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                    >
                        {sub.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
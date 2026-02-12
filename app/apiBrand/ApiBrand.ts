import React from 'react'

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export async function fetchBrands(): Promise<Brand[]> {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', { 
    next: { revalidate: 60 }
  });

  const { data } = await response.json();
  console.log("brand", data);
  
  return data; 
}
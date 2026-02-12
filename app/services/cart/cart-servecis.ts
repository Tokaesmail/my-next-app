'use server'
import { accessToken } from "@/app/schema/accessToken";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function cartServices(productId:string, quantity:number =1) {
    try{
    
    const token=await accessToken()

    const response= await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
        cache:'no-store',
        method:'POST',
        headers:{
            'token': `${token}`,
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            productId,
            quantity
        }),
    });
    const result= await response.json();
    console.log(result);
    return result;
    

}catch (error: any) {
        console.error('Cart Service Error:', error);
        return {
            statusMsg: 'fail',
            message: error.message || 'Failed to add to cart'
        };
    }
}

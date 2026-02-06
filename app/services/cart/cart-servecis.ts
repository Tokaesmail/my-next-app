'use server'
import { accessToken } from "@/app/schema/accessToken";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function cartServices(productId:string, quantity:number) {

    const token=await accessToken()

    const response= await fetch(`${process.env.API}/cart`, {
        cache:'no-store',
        method:'POST',
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            productId,
            quantity
        }),
    });
    const result= await response.json();
    return result;

}
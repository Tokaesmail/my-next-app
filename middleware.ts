import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ['/cart', '/profile', '/wishlist'];
const authPages = ['/login', '/register'];

export async function middleware(req:NextRequest) {
    const token =await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,})

    if(protectedPages.includes(req.nextUrl.pathname)){
        if(token){
            return NextResponse.next();
        }else{
            const RedirectURL= new URL('/login',req.url);
            RedirectURL.searchParams.set('callbackUrl', req.nextUrl.pathname);
            return NextResponse.redirect(RedirectURL);
        }
    }
    if(authPages.includes(req.nextUrl.pathname)){
        if(!token){
            return NextResponse.next();
        }else{
            const RedirectURL= new URL('/',req.url);
            return NextResponse.redirect(RedirectURL);
        }
    }
    return NextResponse.next();

}

export const config = {
matcher: ['/cart', '/profile', '/wishlist', '/login', '/register']
};
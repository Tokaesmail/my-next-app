import { error } from "console";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const token=await getToken({req})

    if(!token){
        return NextResponse.json({error:'unathorized',satus:401})

    }
    const rep=await fetch(`${process.env.API}/cart`,{
        headers:{
            token:(token as any)?.token as string || "",
            'content-type':'application/json  '
        }
    })

    const payload=await rep.json()

    return NextResponse.json(payload)
}
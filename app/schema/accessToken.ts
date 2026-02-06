import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function accessToken() {
    const authToken=(await (cookies())).get('next-auth.session-token')?.value||'';
    const Token=await decode({
        token:authToken,
        secret:process.env.NEXTAUTH_SECRET||'',
    })

    if(!Token){
        throw new Error('User not authenticated');
    }
}
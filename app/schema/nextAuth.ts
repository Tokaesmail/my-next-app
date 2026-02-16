import CredentialsProvider from "next-auth/providers/credentials"
import { FailAuth, SuccessLogin } from "../types/authinterface"
import { NextAuthOptions } from "next-auth"
import { cookies } from "next/headers"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},  
        password: {}
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.API}/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),      
            headers: { 
              "Content-Type": "application/json" 
            }
          });

          if (!res.ok) {
            throw new Error('Authentication failed');
          }

          const payload: FailAuth | SuccessLogin = await res.json();
          
          if ('token' in payload) {
            return {
              id: payload.user.email,
              user: payload.user,
              token: payload.token 
            };
          } else {
            throw new Error(payload.message || "Invalid credentials");
          }
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ], 
  callbacks: {
    jwt: ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    }, 
    session: ({ session, token }: { session: any; token: any }) => {
      session.user = token.user;
      session.token = token.token; 
      return session;
    }
  },
  events: {
    async signIn({ user }: any) {
      if (user?.token) {
        const cookieStore = await cookies();
        cookieStore.set('userToken', user.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          httpOnly: false, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
    }
  },
  session: {
    strategy: "jwt"
  }
}
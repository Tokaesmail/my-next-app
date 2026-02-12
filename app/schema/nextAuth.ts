import CredentialsProvider from "next-auth/providers/credentials"
import { FailAuth, SuccessLogin } from "../types/authinterface"
import { NextAuthOptions } from "next-auth"

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
          
          console.log('Auth Response:', payload);
          
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
          console.error('Auth Error:', error);
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
      session.token = token.token; // إضافة الـ token للـ session
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
}
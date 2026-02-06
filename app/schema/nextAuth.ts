import CredentialsProvider from "next-auth/providers/credentials"
import { FailAuth, SuccessLogin } from "../types/authinterface"
import { NextAuthOptions } from "next-auth"
import NextAuth, { DefaultSession } from "next-auth"
import { jwt } from "zod"


export const authOptions:NextAuthOptions = {
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
    authorize:async (credentials)=> {
      const res = await fetch(`${process.env.API}/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({
          email: credentials?.email,
          password: credentials?.password
        }),      
        headers: { 
            "Content-Type": "application/json" 
        }
      })
      const payload: FailAuth | SuccessLogin = await res.json()
      
      console.log(payload);
      
      if ('token' in payload) {
      return{
          id: payload.user.email,
          user: payload.user,
          token: payload.token
       }
      }else{
          throw new Error(payload.message || "invalid credentials")
         }
  }})
], 
callbacks:{
      jwt:({token, user})=>{
        if(user){
          user.token = user.user
        token.token = user.token
        }
        return token
      }, 
       
      session:({session, token})=>{
        session.user = token.user
         
        return session
     }
    }
}

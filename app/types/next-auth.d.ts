import NextAuth from "next-auth"

declare module "next-auth" {

    interface User {
        token: string
        user:Userinfo
    }

    interface Session {
        user: Userinfo &{
          cart?: number
        }
  }
}

interface Userinfo {
    name: string
    email: string
    role: string
    cart?: number 
}
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User  {
    /** OpenID ID Token */
    idToken?: string
    cart?: number
  }
}
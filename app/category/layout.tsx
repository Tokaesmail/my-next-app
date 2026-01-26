import React from 'react'
import Link from 'next/link'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className="flex">
        <div className="w-1/4 p-4 border-r bg-amber-400 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
                <li><Link href={"/category/mobile"}>Mobile</Link></li>
                <li><Link href={"/category/web"}>Web</Link></li>
            </ul>
        </div>
        <div className="w-3/4 p-4 bg-amber-900 min-h-screen text-white">
            {children}
        </div>
        </div>
        </>
    )
}

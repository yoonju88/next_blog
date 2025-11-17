import Link from 'next/link'
import React from 'react'

export default function Footer() {

    return (
        <footer className="bg-gray-100 mt-36">
            <div className="px-8 py-6 flex flex-col lg:flex-row items-center">
                <h1 className='text-3xl text-foreground font-bold'>
                    <Link href="/">
                        CosCorée
                    </Link>
                </h1>
                <p className="text-sm text-foreground/60 lg:text-left text-center sm:ml-6 mt-4 lg:mt-0">
                    ©2025 All right reserved. Designed and developped by TERRENOIRE Yoonju.
                </p>
            </div>
        </footer>
    )
}

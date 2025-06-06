import Link from 'next/link'
import React from 'react'

export default function Footer() {

    return (
        <div className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap md:text-left text-center order-first">
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
                        <nav className="list-none mb-10">
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-gray-800">First Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Second Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Third Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Fourth Link</Link>
                            </li>
                        </nav>
                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
                        <nav className="list-none mb-10">
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-gray-800">First Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Second Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Third Link</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-grLinky-600 hover:text-grLinky-800">Fourth Link</Link>
                            </li>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100">
                <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
                    <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© 2020 Tailblocks —
                    </p>
                </div>
            </div>
        </div >
    )
}

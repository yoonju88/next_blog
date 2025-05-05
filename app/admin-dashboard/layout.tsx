import React from 'react'

export default function layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="max-w-screen-lg mx-auto px-4 py-10">
            {children}
        </div>
    )
}

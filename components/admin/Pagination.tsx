'use client'
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, goToPage }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 p-4">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
            >Prev</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >{page}</button>
            ))}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
            >Next</button>
        </div>
    );
}
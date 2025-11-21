'use client'
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, goToPage }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 p-4">
            <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border bg-foreground/5 disabled:opacity-50"
                variant="default"
            >
                <ChevronLeftIcon />

            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1  ${currentPage === page ? 'bg-foreground/15' : 'bg-foreground/5'}`}
                >{page}</Button>
            ))}

            <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-foreground/5 disabled:opacity-50"
            >
                <ChevronRightIcon />
            </Button>
        </div>
    );
}
'use client'
import React from 'react'

interface StatsCardProps {
  title: string;
  value: number | string;
  bgColor?: string;

  children: React.ReactNode;
}

export default function StatsCard({ title, value, bgColor = 'bg-gray-100', children }: StatsCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg shadow-md py-4 px-6 border border-gray-200 lg:w-[30%] w-full">
      <div>
        <p className="text-sm text-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`${bgColor} p-4 rounded-full ml-10`}>
        {children}
      </div>
    </div>
  );
}

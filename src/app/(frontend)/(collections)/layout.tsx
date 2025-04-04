import React from 'react'

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="pt-8 mb-4 border-b border-gray-500">
        <h1 className="text-left text-[11px]">--- CATALOGUE INDEX ---</h1>
      </div>
      {children}
    </div>
  )
}

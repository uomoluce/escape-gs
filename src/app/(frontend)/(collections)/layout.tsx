import React from 'react'

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mb-20">
      <div className="pt-8 mb-4 border-b border-[var(--border-color)]">
        <h1 className="text-left">--- CATALOGUE INDEX ---</h1>
      </div>
      {children}
    </div>
  )
}

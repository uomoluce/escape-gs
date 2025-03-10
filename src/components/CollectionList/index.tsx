import React from 'react'

interface Column {
  width?: string
  field: string
}

interface CollectionListProps {
  title: string
  columns: Column[]
  items: any[]
}

/**
 * This component is used to display an archive of items in each collection:
 *  - discography
 *  - mixes
 *  - events
 *  - curatorship
 *  - sound design
 * Designed to look like a table, but really a list of items wrapped in a css grid
 */
export function CollectionList({ title, columns, items }: CollectionListProps) {
  const gridTemplateColumns = columns.map((column) => column.width || '1fr').join(' ')

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title}</h1>

          {items?.map((item) => (
            <div className="grid gap-x-4 gap-y-0" style={{ gridTemplateColumns }} key={item.id}>
              {columns.map(({ field }) => (
                <div key={field} className={field.toLowerCase()}>
                  {item[field]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

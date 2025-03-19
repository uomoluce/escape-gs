import React from 'react'
import { ListWrapper } from './ListWrapper'

interface Column {
  field: string
  width?: string
}

interface Props {
  title?: string
  items: any[]
  columns: Column[]
  collectionType?: 'discography' | 'events' | 'curatorship' | 'mixes' | 'sound-design' | 'default'
  sortBy?: string
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
export const CollectionList: React.FC<Props> = ({
  items,
  columns,
  collectionType = 'default',
  sortBy = 'date',
}) => {
  // Sort items by date in descending order (newest first)
  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[sortBy] || a.year || a.createdAt
    const bValue = b[sortBy] || b.year || b.createdAt

    if (!aValue) return 1
    if (!bValue) return -1

    const aDate = typeof aValue === 'string' ? new Date(aValue) : aValue
    const bDate = typeof bValue === 'string' ? new Date(bValue) : bValue

    // Always sort in descending order (newest first)
    return bDate < aDate ? -1 : bDate > aDate ? 1 : 0
  })

  return (
    <div className="container mb-16">
      <div className="collection-list">
        <div className="collection-list__items w-full">
          <ListWrapper items={sortedItems} columns={columns} collectionType={collectionType} />
        </div>
      </div>
    </div>
  )
}

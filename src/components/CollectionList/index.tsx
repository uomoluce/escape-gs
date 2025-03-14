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
  collectionType?: 'discography' | 'events' | 'curatorship' | 'default'
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
export const CollectionList: React.FC<Props> = ({ items, columns, collectionType = 'default' }) => {
  return (
    <div className="container">
      <div className="collection-list">
        <div className="collection-list__items w-full">
          <ListWrapper items={items} columns={columns} collectionType={collectionType} />
        </div>
      </div>
    </div>
  )
}

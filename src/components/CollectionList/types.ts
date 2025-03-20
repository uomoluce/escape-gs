export type CollectionType =
  | 'discography'
  | 'events'
  | 'curatorship'
  | 'mixes'
  | 'sound-design'
  | 'default'

export interface Column {
  field: string
  width?: string
}

export interface Item {
  id: string
  title: string
  date?: string
  duration?: string
  url?: string
  soundcloudEmbed?: string
  videoEmbed?: string
  audio?: {
    url: string
    mimeType: string
  }
  image?: {
    url: string
    sizes?: {
      thumbnail?: {
        url: string
      }
    }
    thumbnailURL?: string
  } | null
  [key: string]: any // Add index signature to allow string indexing
}

export interface ListItemProps {
  item: Item
  columns: Column[]
  collectionType?: CollectionType
  isAudioVisible: boolean
  onAudioToggle: () => void
}

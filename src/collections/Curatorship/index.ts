import { CollectionConfig } from 'payload'

export const Curatorship: CollectionConfig = {
  slug: 'curatorship',
  labels: {
    singular: 'Curatorship',
    plural: 'Curatorship',
  },
  admin: {
    useAsTitle: 'entity',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'entity',
      type: 'text',
      required: true,
      admin: {
        description: 'Il Pianeta Redenta',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Production',
      },
    },
    {
      name: 'date',
      label: 'Date/Date Range',
      type: 'text',
      required: true,
      admin: {
        description: '2024 - 2025',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: false,
    },
    {
      name: 'audioUrl',
      type: 'text',
      required: false,
      admin: {
        description: 'Direct URL to the audio file (e.g. from AWS)',
      },
      validate: (value: string | undefined | null) => {
        if (!value) return true
        try {
          const url = new URL(value)
          const isAudioFile = /\.(mp3|wav|ogg|m4a)$/i.test(url.pathname)
          if (!isAudioFile) {
            return 'URL must point to an audio file (mp3, wav, ogg, m4a)'
          }
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
  ],
}

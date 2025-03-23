import { CollectionConfig } from 'payload'
import { soundcloudEmbed } from '@/fields/soundcloud'
import { videoEmbed } from '@/fields/videoEmbed'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      name: 'title',
      label: 'Event Title',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
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
    soundcloudEmbed,
    videoEmbed,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

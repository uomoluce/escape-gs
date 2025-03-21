import { CollectionConfig } from 'payload'
import { soundcloudEmbed } from '@/fields/soundcloud'

export const Discography: CollectionConfig = {
  slug: 'discography',
  labels: {
    singular: 'Discography',
    plural: 'Discography',
  },
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
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Union Editions',
      },
    },
    {
      name: 'type',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. 7", EP',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: false,
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload an audio file (MP3)',
      },
    },
    soundcloudEmbed,
  ],
}

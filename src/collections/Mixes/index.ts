import { CollectionConfig } from 'payload'
import { soundcloudEmbed } from '@/fields/soundcloud'
import { videoEmbed } from '@/fields/videoEmbed'

export const Mixes: CollectionConfig = {
  slug: 'mixes',
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
      name: 'platform',
      type: 'text',
      required: true,
      label: 'Platform/Venue',
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
    },
    soundcloudEmbed,
    videoEmbed,
  ],
}

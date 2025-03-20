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
      name: 'type',
      type: 'select',
      required: false,
      options: [
        { label: 'N/A', value: 'not-set' },
        { label: 'Live', value: 'live' },
        { label: 'DJ Set', value: 'dj-set' },
        { label: 'Residence', value: 'residence' },
      ],
      defaultValue: 'not-set',
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
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    soundcloudEmbed,
    videoEmbed,
  ],
}

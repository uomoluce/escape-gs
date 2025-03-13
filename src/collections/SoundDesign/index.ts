import { CollectionConfig } from 'payload'

export const SoundDesign: CollectionConfig = {
  slug: 'sound-design',
  labels: {
    singular: 'Sound Design',
    plural: 'Sound Design',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Site Pages',
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
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      type: 'text',
      required: false,
    },
  ],
}

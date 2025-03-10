import { CollectionConfig } from 'payload'

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
  ],
}

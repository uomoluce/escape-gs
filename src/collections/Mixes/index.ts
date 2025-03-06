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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      name: 'platformVenue',
      type: 'text',
      required: true,
      label: 'Platform/Venue',
    },
  ],
}

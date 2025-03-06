import { CollectionConfig } from 'payload'

export const SoundDesign: CollectionConfig = {
  slug: 'sound-design',
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
      name: 'platform',
      type: 'text',
      required: true,
    },
  ],
}

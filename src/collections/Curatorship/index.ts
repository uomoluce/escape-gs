import { CollectionConfig } from 'payload'

export const Curatorship: CollectionConfig = {
  slug: 'curatorship',
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
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}

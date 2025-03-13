import { CollectionConfig } from 'payload'

export const Curatorship: CollectionConfig = {
  slug: 'curatorship',
  labels: {
    singular: 'Curatorship',
    plural: 'Curatorship',
  },
  admin: {
    useAsTitle: 'entity',
    group: 'Site Pages',
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
  ],
}

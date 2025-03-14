import { CollectionConfig } from 'payload'

export const Discography: CollectionConfig = {
  slug: 'discography',
  labels: {
    singular: 'Discography',
    plural: 'Discography',
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
  ],
}

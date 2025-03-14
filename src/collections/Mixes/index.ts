import { CollectionConfig } from 'payload'

export const Mixes: CollectionConfig = {
  slug: 'mixes',
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
      label: 'Platform/Venue',
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
    {
      name: 'duration',
      type: 'text',
      required: false,
      validate: (val: any) => {
        // Optional: Validate duration format (e.g., "MM:SS" or "HH:MM:SS")
        const durationRegex = /^(?:\d{1,2}:)?[0-5]?\d:[0-5]\d$/
        if (!durationRegex.test(val)) {
          return 'Please enter duration in format MM:SS or HH:MM:SS'
        }
        return true
      },
      admin: {
        description: 'e.g. 2:30',
      },
    },
  ],
}

import { CollectionConfig } from 'payload'

export const Discography: CollectionConfig = {
  slug: 'discography',
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
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'text',
      required: true,
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
    },
  ],
}

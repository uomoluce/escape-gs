import { Field } from 'payload'

export const soundcloudEmbed: Field = {
  name: 'soundcloudEmbed',
  type: 'textarea',
  admin: {
    description:
      'Paste the Soundcloud embed code here. This will be used instead of the audio player when no audio file is uploaded.',
  },
  validate: (value) => {
    if (!value) return true
    // Basic validation to ensure it's an iframe from Soundcloud
    if (!value.includes('<iframe') || !value.includes('soundcloud.com')) {
      return 'Please enter a valid Soundcloud embed code'
    }
    return true
  },
}

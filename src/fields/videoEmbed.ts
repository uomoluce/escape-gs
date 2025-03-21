import { Field } from 'payload'

export const videoEmbed: Field = {
  name: 'videoEmbed',
  type: 'textarea',
  admin: {
    description:
      'Paste the YouTube or Vimeo embed code here. This will be used to display the video in the list.',
  },
  validate: (value) => {
    if (!value) return true
    // Basic validation to ensure it's an iframe from YouTube or Vimeo
    if (
      !value.includes('<iframe') ||
      (!value.includes('youtube.com') && !value.includes('vimeo.com'))
    ) {
      return 'Please enter a valid YouTube or Vimeo embed code'
    }
    return true
  },
}

import type { Block } from 'payload'

export const Embed: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  fields: [
    {
      name: 'html',
      type: 'textarea',
      label: 'Embed Code',
      required: true,
      admin: {
        description: 'Paste your embed code here (e.g. SoundCloud, YouTube, etc.)',
      },
    },
  ],
}

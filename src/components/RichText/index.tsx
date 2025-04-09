import React from 'react'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { EmbedBlock } from '@/blocks/Embed/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'

import type {
  MediaBlock as MediaBlockProps,
  ContentBlock as ContentBlockProps,
  FormBlock as FormBlockProps,
} from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps | { html: string }>

type EmbedNode = {
  fields: {
    html: string
  }
}

type BlockNode<T> = {
  fields: T
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    mediaBlock: ({ node }: { node: BlockNode<MediaBlockProps> }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    embed: ({ node }: { node: EmbedNode }) => (
      <EmbedBlock className="col-start-1" {...node.fields} />
    ),
    content: ({ node }: { node: BlockNode<ContentBlockProps> }) => (
      <ContentBlock {...node.fields} />
    ),
    formBlock: ({ node }: { node: BlockNode<FormBlockProps> }) => {
      const { id, blockName, enableIntro, introContent, form, ...otherFields } = node.fields

      return (
        <FormBlock
          id={id || undefined}
          blockName={blockName || undefined}
          enableIntro={enableIntro || false}
          introContent={introContent || undefined}
          form={form as any}
          {...otherFields}
        />
      )
    },
  },
})

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert ': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}

import type { Metadata } from 'next/types'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      content: true,
      createdAt: true,
    },
  })

  return (
    <>
      <PageClient />
      <div className="container mb-20">
        <div className="pt-8 mb-4 border-b border-[var(--border-color)]">
          <h1 className="text-left text-[11px]">--- DESK INDEX ---</h1>
        </div>

        <div className="flex flex-col gap-8">
          {posts?.docs.map((post, index) => (
            <article
              key={post.slug}
              className={`pb-8 ${index !== posts.docs.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
            >
              <p className="text-[var(--secondary-text)] text-base">
                {new Date(post.createdAt).toISOString().replace('T', ' ').split('.')[0]}
              </p>
              <h1 className="text-left text-[11px] uppercase">--- {post.title} ---</h1>
              {post.content && (
                <div className="prose mt-4">
                  <RichText data={post.content} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12) // Changed from 10 to 12 to match the limit

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

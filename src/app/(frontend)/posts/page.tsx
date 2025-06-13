import type { Metadata } from 'next/types'
import React from 'react'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
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
      <div className="container mb-20">
        <div className="pt-8 mb-4 border-b border-[var(--border-color)]">
          <h1 className="text-left">--- DESK INDEX ---</h1>
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
              <h1 className="text-left uppercase">--- {post.title} ---</h1>
              {/* Hiding categories for now */}
              {/* {Array.isArray(post.categories) && post.categories.length > 0 && (
                <div className="text-[var(--secondary-text)]">
                  {post.categories.map((category, index) => {
                    if (typeof category === 'object' && category !== null) {
                      const { title: categoryTitle } = category
                      const isLast = index === post.categories!.length - 1
                      return (
                        <React.Fragment key={index}>
                          {categoryTitle}
                          {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                        </React.Fragment>
                      )
                    }
                    return null
                  })}
                </div>
              )} */}
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

export function generateMetadata(): Metadata {
  return {
    title: `Posts`,
  }
}

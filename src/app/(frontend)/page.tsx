import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/discography')
}

export const dynamic = 'force-static'
export const revalidate = 600

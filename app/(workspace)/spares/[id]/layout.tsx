import { notFound } from 'next/navigation'
import { getRequestById } from '@/lib/mock-data'
import { RequestHeader } from '@/components/request/request-header'
import { RequestTabs } from '@/components/request/request-tabs'

export default async function SpareRequestLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = getRequestById(id)

  if (!request) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-5">
      <RequestHeader request={request} />
      <RequestTabs requestId={id} />
      <div>{children}</div>
    </div>
  )
}

'use client'

import { StatusBadge } from '@/components/status-badge'
import { useDecisionState } from '@/lib/app-providers'

export function TechnicalSummaryCard({ requestId, internalReference, oemReference }: { requestId: string; internalReference: string; oemReference: string }) {
  const { state } = useDecisionState(requestId)
  return (
    <section className="rounded-xl bg-muted/35 p-4">
      <h3 className="mb-3 font-semibold">Technical</h3>
      <SummaryItem label="Replacement Identified" value="Yes" />
      <SummaryItem label="Internal Reference" value={internalReference} />
      <SummaryItem label="Current OEM Reference" value={oemReference} />
      <SummaryItem label="Compatibility"><StatusBadge status={state.compatibility === 'Validated' ? 'Validated' : 'Pending Confirmation'} tone={state.compatibility === 'Validated' ? 'success' : 'warning'} /></SummaryItem>
    </section>
  )
}

export function AlternativeSummaryCard({ requestId, supplierName, price, leadTime }: { requestId: string; supplierName: string; price: string; leadTime: string }) {
  const { state } = useDecisionState(requestId)
  const approved = state.supplierBQualification === 'Approved'
  const inReview = state.supplierBQualification === 'Technical Review Requested'
  return (
    <section className={`rounded-xl border p-4 ${approved ? 'border-success/30 bg-success/[0.07]' : 'border-warning/30 bg-warning/[0.07]'}`}>
      <h3 className="mb-3 font-semibold">Alternative</h3>
      <SummaryItem label="Supplier" value={supplierName} />
      <SummaryItem label="Price" value={price} />
      <SummaryItem label="Lead Time" value={leadTime} />
      <SummaryItem label="Can Meet Timing?" value="Potentially Yes" />
      <SummaryItem label={approved ? 'Qualification' : 'Current Blocker'}>
        <StatusBadge
          status={approved ? 'Technically Qualified' : inReview ? 'Technical Review In Progress' : 'Technical Qualification Required'}
          tone={approved ? 'success' : inReview ? 'info' : 'warning'}
        />
      </SummaryItem>
    </section>
  )
}

function SummaryItem({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return <div className="mb-3 flex flex-col gap-1 last:mb-0"><span className="text-xs text-muted-foreground">{label}</span>{children ?? <span className="text-sm font-medium text-foreground">{value}</span>}</div>
}

import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/status-badge'
import { ApprovalActions } from '@/components/request/approval-actions'
import { DecisionLiveStatus } from '@/components/request/decision-live-status'
import {
  getRequestById,
  DATA_CONFLICTS,
  SUPPLIERS,
  OUTSTANDING_ACTIONS,
} from '@/lib/mock-data'
import { RoleAccessBanner } from '@/components/role-access-banner'
import { DecisionReadinessChecklist } from '@/components/request/decision-readiness-checklist'
import { AlternativeSummaryCard, TechnicalSummaryCard } from '@/components/request/decision-summary-live-facts'

export default async function DecisionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
  const openConflicts = DATA_CONFLICTS.filter((c) => c.status !== 'Outdated')
  const alternativeSupplier = SUPPLIERS.find((s) => s.id === 'sup-b') ?? SUPPLIERS[0]
  const oemSupplier = SUPPLIERS.find((s) => s.id === 'sup-oem') ?? SUPPLIERS[0]

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Decision summary</h2><p className="mt-1 text-sm text-muted-foreground">Complete decision context for {id} · <span className="font-semibold text-destructive">Attention Required</span></p></div>
      <RoleAccessBanner permission="prepare-management-review" />
      <DecisionLiveStatus requestId={id} />
      <Card>
        <CardHeader>
          <CardTitle>Decision Summary</CardTitle>
          <CardDescription>
            Consolidated view of this request&apos;s readiness for management approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <section className="rounded-xl bg-muted/35 p-4"><h3 className="mb-3 font-semibold">Requirement</h3><SummaryItem label="Part Required" value={`${request.spare} ${request.partNumberTo}`} /><SummaryItem label="Equipment" value={request.equipment} /><SummaryItem label="Unit" value={request.unit} /><SummaryItem label="Required Before" value="10 Nov 2026" /><SummaryItem label="Criticality"><StatusBadge status={request.criticality} /></SummaryItem></section>
            <TechnicalSummaryCard requestId={id} internalReference={request.partNumberFrom} oemReference={request.partNumberTo} />
            <section className="rounded-xl bg-muted/35 p-4"><h3 className="mb-3 font-semibold">Inventory</h3><SummaryItem label="Available" value="0" /><SummaryItem label="Reserved" value="1" /><SummaryItem label="In Transit" value="0" /><SummaryItem label="Allocation" value="Unit 1 Overhaul · WO-1843" /></section>
            <section className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-4"><h3 className="mb-3 font-semibold">Approved supplier</h3><SummaryItem label="Supplier" value={oemSupplier.name} /><SummaryItem label="Price" value={currency.format(oemSupplier.price)} /><SummaryItem label="Lead Time" value="14 weeks" /><SummaryItem label="Will It Arrive in Time?"><StatusBadge status="No" tone="destructive" /></SummaryItem></section>
            <AlternativeSummaryCard requestId={id} supplierName={alternativeSupplier.name} price={currency.format(alternativeSupplier.price)} leadTime="5 weeks" />
            <section className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-4"><h3 className="mb-3 font-semibold">Operational risk</h3><p className="text-4xl font-semibold tracking-[-0.05em] text-destructive">HIGH</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Approved OEM delivery exceeds the maintenance window; the faster source is not yet qualified.</p></section>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Readiness Checklist</CardTitle>
            <CardDescription>Status of each validation step across the workflow</CardDescription>
          </CardHeader>
          <CardContent><DecisionReadinessChecklist requestId={id} openConflictCount={openConflicts.length} /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Commercial timing facts</CardTitle>
            <CardDescription>Neutral supplier facts requiring human review</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{alternativeSupplier.name}</span>
                <StatusBadge status={alternativeSupplier.qualification} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {currency.format(alternativeSupplier.price)} · {alternativeSupplier.leadTimeWeeks} week lead
                time · {alternativeSupplier.source} · Potentially meets timing
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2.5">
              {OUTSTANDING_ACTIONS.map((action) => (
                <div key={action} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warning/35 bg-warning/[0.055]"><CardHeader><CardTitle className="text-xl">Attention required</CardTitle><CardDescription className="max-w-3xl text-sm text-foreground">Supplier B can meet the required delivery window, but technical qualification must be completed before the planned maintenance date.</CardDescription></CardHeader><CardContent><p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Outstanding decision inputs</p><div className="grid gap-2 sm:grid-cols-2">{OUTSTANDING_ACTIONS.map((action,index)=><div key={action} className="flex items-start gap-3 rounded-xl bg-card/70 p-3 text-sm"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-warning/15 text-xs font-semibold text-warning-foreground">{index+1}</span>{action}</div>)}</div></CardContent></Card>
      <Card><CardHeader><CardTitle>Decision status controls</CardTitle><CardDescription>Review unresolved inputs or compile the record for management.</CardDescription></CardHeader><CardContent><ApprovalActions requestId={id} /></CardContent></Card>
    </div>
  )
}

function SummaryItem({
  label,
  value,
  sub,
  children,
}: {
  label: string
  value?: string
  sub?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-3 flex flex-col gap-1 last:mb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children ?? <span className="text-sm font-medium text-foreground">{value}</span>}
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  )
}

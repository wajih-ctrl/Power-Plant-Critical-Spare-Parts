'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AlertTriangle, ArrowUpRight, CalendarDays, ChevronLeft, ClipboardList, Gauge, UserRound } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import type { SpareRequestSummary } from '@/lib/types'
import { DecisionLiveStatus } from '@/components/request/decision-live-status'
import { useDecisionState } from '@/lib/app-providers'

export function RequestHeader({ request }: { request: SpareRequestSummary }) {
  const { state } = useDecisionState(request.id)
  const technicalDone = state.compatibility === 'Validated'
  const supplierReviewStarted = state.supplierBQualification !== 'Pending'
  const verifiedOrRequested = state.physicalVerificationStatus === 'Verification Requested'
  const reviewedSteps = state.managementReviewReady ? 8 : 3 + Number(technicalDone) + Number(supplierReviewStarted)
  const readiness = state.managementReviewReady ? 100 : 38 + Number(technicalDone) * 17 + Number(supplierReviewStarted) * 13 + Number(verifiedOrRequested) * 8
  const openBlockers = state.managementReviewReady ? 0 : Math.max(1, 4 - Number(technicalDone) - Number(supplierReviewStarted) - Number(verifiedOrRequested))
  const nextOwner = technicalDone ? state.supplierBQualification === 'Approved' ? 'Procurement' : 'Engineering' : 'Engineering'

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="w-fit px-0 text-muted-foreground hover:bg-transparent hover:text-primary" render={<Link href="/spares" />} nativeButton={false}>
        <ChevronLeft data-icon="inline-start" />All Critical Spares
      </Button>

      <section className="decision-hero relative overflow-hidden rounded-[1.4rem] text-white shadow-[0_24px_60px_rgba(10,27,58,.22)]">
        <div className="pointer-events-none absolute -right-28 -top-36 size-80 rounded-full border border-white/10 bg-blue-400/10 blur-sm" />
        <div className="pointer-events-none absolute -bottom-44 left-[38%] size-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15"><ClipboardList className="size-4.5 text-blue-200" /></span>
              <span className="text-xs font-semibold tracking-[0.12em] text-blue-200">{request.id}</span>
              <span className="rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/80">ACTIVE DECISION</span>
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
              {request.spare}
              <span className="ml-2 text-white/38">{request.partNumberFrom} → {request.partNumberTo}</span>
            </h1>
            <p className="mt-3 text-[15px] text-white/60">{request.equipment} · {request.unit} · {request.plant} · Work Order <span className="font-semibold text-white/85">{request.workOrder}</span></p>

            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge status={request.criticality} className="border-red-300/20 bg-red-400/15 text-red-100" />
              <DecisionLiveStatus requestId={request.id} compact className="border-amber-200/20 bg-amber-300/15 text-amber-100" />
              <StatusBadge status="No Available Stock" className="border-red-300/20 bg-red-400/15 text-red-100" />
              <StatusBadge status="Lead-Time Risk" className="border-red-300/20 bg-red-400/15 text-red-100" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
              <HeroFact label="Internal reference" value={request.partNumberFrom} />
              <HeroFact label="Current OEM reference" value={request.partNumberTo} accent />
              <HeroFact label="Required before" value="10 Nov 2026" icon={<CalendarDays className="size-3.5" />} />
              <HeroFact label="Requested by" value={request.requestedBy} sub={request.requestedByRole} icon={<UserRound className="size-3.5" />} />
            </div>
          </div>

          <aside className="self-stretch rounded-2xl border border-white/10 bg-white/[0.065] p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/45">Decision readiness</p><p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{readiness}<span className="ml-1 text-lg text-white/45">%</span></p></div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/15"><Gauge className="size-5" /></span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-[width]" style={{ width: `${readiness}%` }} /></div>
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between"><span className="text-white/50">Reviewed steps</span><span className="font-semibold">{reviewedSteps} of 8</span></div>
              <div className="flex items-center justify-between"><span className="text-white/50">Open blockers</span><span className="font-semibold">{openBlockers}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/50">Operational risk</span><span className="flex items-center gap-1.5 font-semibold text-red-200"><AlertTriangle className="size-3.5" />High</span></div>
              <div className="flex items-center justify-between"><span className="text-white/50">Next owner</span><span className="font-semibold">{nextOwner}</span></div>
            </div>
            <Button className="mt-5 w-full border border-white/10 bg-white text-slate-900 shadow-none hover:bg-blue-50" render={<Link href={`/spares/${request.id}/summary`} />} nativeButton={false}>
              Review decision <ArrowUpRight data-icon="inline-end" />
            </Button>
          </aside>
        </div>
      </section>
    </div>
  )
}

function HeroFact({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent?: boolean; icon?: ReactNode }) {
  return <div className="bg-slate-950/25 px-4 py-3.5"><p className="flex items-center gap-1.5 text-[11px] font-medium text-white/42">{icon}{label}</p><p className={`mt-1 text-sm font-semibold ${accent ? 'text-blue-200' : 'text-white/90'}`}>{value}</p>{sub && <p className="mt-0.5 text-[11px] text-white/40">{sub}</p>}</div>
}

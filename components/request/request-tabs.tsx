'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, Circle, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDecisionState } from '@/lib/app-providers'

const SECTIONS = [
  { label: 'Requirement', segment: '', state: 'done' },
  { label: 'Part Validation', segment: 'technical-validation', state: 'warning' },
  { label: 'Inventory', segment: 'inventory-maintenance', state: 'done' },
  { label: 'Maintenance', segment: 'inventory-maintenance', state: 'done' },
  { label: 'Supplier Review', segment: 'suppliers', state: 'warning' },
  { label: 'Data Conflicts', segment: 'conflicts', state: 'warning' },
  { label: 'Risk Review', segment: 'risk', state: 'warning' },
  { label: 'Decision Summary', segment: 'summary', state: 'pending' },
]

export function RequestTabs({ requestId }: { requestId: string }) {
  const pathname = usePathname()
  const { state: decisionState } = useDecisionState(requestId)
  const base = `/spares/${requestId}`
  const reviewedSteps = decisionState.managementReviewReady
    ? 8
    : 3 + Number(decisionState.compatibility === 'Validated') + Number(decisionState.supplierBQualification !== 'Pending')
  const progress = Math.round((reviewedSteps / SECTIONS.length) * 100)

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_24px_rgba(15,23,42,.045)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-muted/25 px-4 py-3 sm:px-5">
        <div><p className="text-sm font-semibold">Decision path</p><p className="mt-0.5 text-xs text-muted-foreground">Review every input before management sign-off</p></div>
        <div className="flex items-center gap-3"><div className="hidden w-28 overflow-hidden rounded-full bg-muted sm:block"><div className="h-1.5 rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div><span className="rounded-full border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-xs font-semibold text-primary">{reviewedSteps} of 8 reviewed</span></div>
      </div>
      <div className="overflow-x-auto px-3 py-3">
      <nav className="flex min-w-max items-start">
        {SECTIONS.map((section, index) => {
          const href = section.segment ? `${base}/${section.segment}` : base
          const active = pathname === href
          const stepState = index === 1 && decisionState.compatibility === 'Validated'
            ? 'done'
            : index === 4 && decisionState.supplierBQualification === 'Approved'
              ? 'done'
              : index === 7 && decisionState.managementReviewReady
                ? 'done'
                : section.state
          return (
            <Link
              key={section.label}
              href={href}
              className={cn(
                'group relative flex min-w-[148px] flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium whitespace-nowrap text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground',
                active && 'bg-primary/[0.075] font-semibold text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_12%,transparent)]',
              )}
            >
              <span className={cn(
                'relative z-10 flex size-7 items-center justify-center rounded-full border bg-card transition-colors',
                stepState === 'done' && 'border-success/35 bg-success/10 text-success',
                stepState === 'warning' && 'border-warning/40 bg-warning/15 text-warning-foreground',
                active && 'border-primary bg-primary text-primary-foreground',
              )}>
                {active ? <Circle className="size-3 fill-current" /> : stepState === 'done' ? <Check className="size-3.5" /> : stepState === 'warning' ? <TriangleAlert className="size-3.5" /> : <Circle className="size-3" />}
              </span>
              <span>{index + 1}. {section.label}</span>
              {index < SECTIONS.length - 1 && <span className="absolute left-[calc(50%+22px)] top-[21px] h-px w-[calc(100%-44px)] bg-border" />}
            </Link>
          )
        })}
      </nav>
      </div>
    </div>
  )
}

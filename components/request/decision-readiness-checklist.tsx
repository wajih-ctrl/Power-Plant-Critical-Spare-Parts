'use client'

import { StatusBadge } from '@/components/status-badge'
import { useDecisionState } from '@/lib/app-providers'

export function DecisionReadinessChecklist({ requestId, openConflictCount }: { requestId: string; openConflictCount: number }) {
  const { state } = useDecisionState(requestId)
  const compatibilityDone = state.compatibility === 'Validated'
  const verificationRequested = state.physicalVerificationStatus === 'Verification Requested'
  const supplierApproved = state.supplierBQualification === 'Approved'
  const supplierReviewStarted = state.supplierBQualification === 'Technical Review Requested'

  return (
    <div className="flex flex-col gap-3">
      <ChecklistRow
        label="Technical compatibility validated"
        status={compatibilityDone ? 'Done' : 'Outstanding'}
        tone={compatibilityDone ? 'success' : 'warning'}
      />
      <ChecklistRow
        label="Physical stock verification"
        status={verificationRequested ? 'Requested' : 'Outstanding'}
        tone={verificationRequested ? 'info' : 'warning'}
      />
      <ChecklistRow
        label="Alternative supplier qualified"
        status={supplierApproved ? 'Done' : supplierReviewStarted ? 'In Review' : 'Outstanding'}
        tone={supplierApproved ? 'success' : supplierReviewStarted ? 'info' : 'warning'}
      />
      <ChecklistRow label="Data conflicts resolved" status={`${openConflictCount} Open`} tone="warning" />
      <ChecklistRow label="Operational risk assessed" status="Done · High" tone="success" />
    </div>
  )
}

function ChecklistRow({ label, status, tone }: { label: string; status: string; tone: 'success' | 'warning' | 'info' }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${tone === 'success' ? 'bg-success' : tone === 'info' ? 'bg-info' : 'bg-warning'}`} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <StatusBadge status={status} tone={tone} className="shrink-0" />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDecisionState } from '@/lib/app-providers'

export function CurrentDecisionState({ requestId }: { requestId: string }) {
  const { state } = useDecisionState(requestId)
  const supplierState = state.supplierBQualification === 'Approved' ? 'Qualified' : state.supplierBQualification === 'Technical Review Requested' ? 'In review' : 'Pending'
  const blockingItem = state.compatibility !== 'Validated'
    ? 'Compatibility validation'
    : state.supplierBQualification !== 'Approved'
      ? 'Technical qualification'
      : state.physicalVerificationStatus !== 'Verification Requested'
        ? 'Stock verification'
        : 'Commercial decision'

  const facts = [
    ['Correct replacement', 'Identified'],
    ['Compatibility', state.compatibility === 'Validated' ? 'Validated' : 'Pending'],
    ['Available stock', '0'],
    ['Approved supplier in time', 'No'],
    ['Alternative in time', 'Yes'],
    ['Alternative qualification', supplierState],
    ['Blocking item', blockingItem],
    ['Operational risk', 'High'],
  ]

  return (
    <Card className="border-0 bg-[linear-gradient(145deg,#132b50,#0a1c38)] text-white shadow-[0_18px_42px_rgba(8,24,51,.2)]">
      <CardHeader><CardTitle className="text-white">Current decision state</CardTitle><CardDescription className="text-white/50">Latest compiled inputs for this request.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {facts.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 border-b border-white/8 pb-3 text-sm last:border-0 last:pb-0"><span className="text-white/48">{label}</span><span className="text-right font-semibold text-white">{value}</span></div>)}
        <Button className="mt-3 w-full border border-white/10 bg-white text-slate-900 shadow-none hover:bg-blue-50" render={<Link href={`/spares/${requestId}/summary`} />} nativeButton={false}>Open Decision Summary<ArrowRight data-icon="inline-end" /></Button>
      </CardContent>
    </Card>
  )
}

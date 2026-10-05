'use client'

import { Check } from 'lucide-react'
import { useDecisionState } from '@/lib/app-providers'
import { StatusBadge } from '@/components/status-badge'

export function DecisionLiveStatus({requestId,compact=false,className}:{requestId:string;compact?:boolean;className?:string}){
 const {state}=useDecisionState(requestId)
 if(compact) return <StatusBadge status={state.compatibility==='Validated'?'Validated':'Technical Validation Pending'} className={className} />
 return <div className="grid gap-3 sm:grid-cols-2"><div className={`rounded-xl border p-3 ${state.compatibility==='Validated'?'border-success/25 bg-success/10':'border-warning/30 bg-warning/[0.08]'}`}><p className="text-xs text-muted-foreground">Technical compatibility</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold">{state.compatibility}{state.compatibility==='Validated'&&<Check className="size-4 text-success" />}</p></div><div className={`rounded-xl border p-3 ${state.managementReviewReady?'border-success/25 bg-success/10':'border-border bg-muted/35'}`}><p className="text-xs text-muted-foreground">Decision status</p><p className="mt-1 text-sm font-semibold">{state.managementReviewReady?'Management Review Ready':'Attention Required'}</p></div></div>
}

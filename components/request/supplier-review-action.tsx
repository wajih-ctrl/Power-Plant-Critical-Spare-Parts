'use client'

import * as React from 'react'
import { Building2, Check, FileText, LockKeyhole, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { useDecisionState } from '@/lib/app-providers'
import { usePermissionAction } from '@/components/permission-action'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function SupplierReviewAction({ requestId }: { requestId: string }) {
  const { state, sendSupplierBToReview, approveSupplierB } = useDecisionState(requestId)
  const { allowed, requirePermission } = usePermissionAction('review-supplier')
  const { allowed: canApprove, requirePermission: requireTechnicalPermission } = usePermissionAction('validate-technical')
  const [open, setOpen] = React.useState(false)
  const [docsOpen, setDocsOpen] = React.useState(false)
  const requested = state.supplierBQualification === 'Technical Review Requested'
  const approved = state.supplierBQualification === 'Approved'

  return <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>{approved ? 'Qualification Approved' : requested ? 'Open Review' : 'Review Qualification'}</SheetTrigger>
      <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b border-border p-6"><span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="size-5" /></span><SheetTitle className="text-xl font-semibold">Supplier B qualification</SheetTitle><SheetDescription>Alternative regional source · 5-week lead time</SheetDescription></SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className={`mb-5 rounded-xl border p-4 ${approved ? 'border-success/30 bg-success/10' : 'border-warning/30 bg-warning/[0.08]'}`}><div className="flex items-center justify-between"><p className="font-semibold">Technical qualification</p><StatusBadge status={approved ? 'Approved' : requested ? 'In Review' : 'Pending'} /></div><p className="mt-2 text-sm text-muted-foreground">{approved ? 'Engineering confirmed the submitted technical package for this mocked sourcing decision.' : 'Supplier B can potentially meet the delivery window, but engineering approval is required before commercial action.'}</p></div>
          <div className="space-y-1">{[['Commercial Registration','Valid'],['Previous Supply History','No purchases for this part'],['Quality Documentation','Received'],['Technical Datasheet','Received'],['Engineering Review',approved ? 'Approved' : requested ? 'Technical Review Requested' : 'Pending']].map(([label,value])=><div key={label} className="flex items-center justify-between gap-3 border-b border-border py-3 text-sm last:border-0"><span className="text-muted-foreground">{label}</span><span className="text-right font-semibold">{value}</span></div>)}</div>
          {requested && <div className="mt-5 flex items-center gap-3 rounded-xl bg-info/10 p-4"><span className="flex size-9 items-center justify-center rounded-full bg-card text-info"><UserRound className="size-4" /></span><div><p className="text-sm font-semibold">Assigned to Engineering Team</p><p className="text-xs text-muted-foreground">Status: In Review</p></div></div>}
          {approved && <div className="mt-5 flex items-center gap-3 rounded-xl bg-success/10 p-4"><span className="flex size-9 items-center justify-center rounded-full bg-card text-success"><Check className="size-4" /></span><div><p className="text-sm font-semibold">Technical qualification complete</p><p className="text-xs text-muted-foreground">Mock approval recorded by Engineering.</p></div></div>}
        </div>
        <SheetFooter className="shrink-0 border-t border-border p-5"><Button variant="outline" onClick={()=>setDocsOpen(true)}><FileText data-icon="inline-start" />View Documentation</Button>{approved ? <Button variant="secondary" disabled><Check data-icon="inline-start" />Qualification Approved</Button> : requested ? <Button onClick={()=>requireTechnicalPermission(approveSupplierB)}>{canApprove ? <Check data-icon="inline-start" /> : <LockKeyhole data-icon="inline-start" />}Approve Technical Qualification</Button> : <Button onClick={()=>requirePermission(sendSupplierBToReview)}>{!allowed && <LockKeyhole data-icon="inline-start" />}Send to Technical Review</Button>}</SheetFooter>
      </SheetContent>
    </Sheet>
    <Dialog open={docsOpen} onOpenChange={setDocsOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-lg"><DialogHeader><DialogTitle className="text-xl font-semibold">Supplier B documentation</DialogTitle><DialogDescription>Qualification package received 29 September 2026.</DialogDescription></DialogHeader><div className="space-y-2">{['Technical Datasheet · MS-421B equivalent','ISO 9001 Quality Certificate','Material Traceability Statement','Regional Commercial Registration'].map(name=><div key={name} className="flex items-center gap-3 rounded-xl border border-border p-3"><FileText className="size-4 text-primary" /><span className="text-sm font-semibold">{name}</span><Check className="ml-auto size-4 text-success" /></div>)}</div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button onClick={()=>setDocsOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
  </>
}

export function SupplierDetailsAction({name}:{name:string}){
  const [open,setOpen]=React.useState(false)
  return <Dialog open={open} onOpenChange={setOpen}><Button variant="outline" size="sm" onClick={()=>setOpen(true)}>View Details</Button><DialogContent className="rounded-2xl p-6 sm:max-w-md"><DialogHeader><DialogTitle className="text-xl font-semibold">{name}</DialogTitle><DialogDescription>Approved supplier record and commercial context.</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-3">{[['Qualification','Approved'],['Source','International'],['Contract',name==='OEM Supplier'?'FA-17':'AV-09'],['Open PO','None']].map(([label,value])=><div key={label} className="rounded-xl bg-muted/45 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button onClick={()=>setOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
}

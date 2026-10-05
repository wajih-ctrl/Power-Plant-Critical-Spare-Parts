'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Building2, CalendarDays, Check, ClipboardPlus, LockKeyhole, Save, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'
import type { Criticality } from '@/lib/types'
import { usePermissionAction } from '@/components/permission-action'
import { RoleAccessBanner } from '@/components/role-access-banner'

const CRITICALITIES: Criticality[] = ['Low', 'Medium', 'High', 'Critical']

export default function NewCriticalSpareRequestPage() {
  const router = useRouter()
  const [criticality, setCriticality] = React.useState<Criticality>('Critical')
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [draftSaved, setDraftSaved] = React.useState(false)
  const { allowed, requirePermission } = usePermissionAction('create-request')

  return (
    <div className="flex flex-col gap-7 pb-36 sm:pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"><span className="h-px w-6 bg-primary/60" />New requirement</div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em]">Create critical spare request</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Capture the equipment context and timing needed to begin a traceable decision.</p>
        </div>
        {draftSaved && <div className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-sm font-semibold text-success"><Check className="size-4" />Draft saved locally</div>}
      </div>
      <RoleAccessBanner permission="create-request" />

      <fieldset disabled={!allowed} className="contents disabled:opacity-70">
      <Card>
        <CardHeader className="border-b border-border/70">
          <CardTitle className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="size-4.5" /></span>Plant & equipment</CardTitle>
          <CardDescription>Selecting the equipment populates its current model and configuration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 pt-1 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Plant"><Select defaultValue="sample"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Sample Power Plant</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="sample">Sample Power Plant</SelectItem><SelectItem value="riverside">Riverside Generating Station</SelectItem></SelectGroup></SelectContent></Select></Field>
          <Field label="Generating unit"><Select defaultValue="unit-2"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Unit 2</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="unit-1">Unit 1</SelectItem><SelectItem value="unit-2">Unit 2</SelectItem><SelectItem value="gt-02">GT-02</SelectItem></SelectGroup></SelectContent></Select></Field>
          <Field label="Equipment"><Select defaultValue="p-201"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Cooling Water Pump P-201</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="p-201">Cooling Water Pump P-201</SelectItem><SelectItem value="bfp-102">Boiler Feed Pump BFP-102</SelectItem></SelectGroup></SelectContent></Select></Field>
          <Field label="Equipment model"><Input value="CWP-900" readOnly className="h-10 rounded-xl bg-muted/55" /></Field>
          <Field label="Configuration / version"><Input value="Rev. C / Unit 2 Configuration" readOnly className="h-10 rounded-xl bg-muted/55" /></Field>
          <Field label="Equipment record"><Input value="EQ-P201" readOnly className="h-10 rounded-xl bg-muted/55" /></Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/70">
          <CardTitle className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Wrench className="size-4.5" /></span>Spare requirement</CardTitle>
          <CardDescription>Define the part, urgency and maintenance timing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 pt-1 sm:grid-cols-2">
          <Field label="Request ID"><Input value="CSR-2026-014" readOnly className="h-10 rounded-xl bg-muted/55" /></Field>
          <Field label="Spare part"><Input defaultValue="Mechanical Seal" className="h-10 rounded-xl" /></Field>
          <Field label="Current part number"><Input defaultValue="MS-420" className="h-10 rounded-xl" /></Field>
          <Field label="Requirement description" className="sm:col-span-2"><Textarea defaultValue="Replacement required during planned maintenance for Cooling Water Pump P-201." className="min-h-24 rounded-xl" /></Field>
          <div className="sm:col-span-2">
            <Label className="mb-2.5 block text-sm font-semibold">Criticality</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CRITICALITIES.map((level) => <button key={level} type="button" onClick={() => setCriticality(level)} className={cn('flex items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition-all', criticality === level ? 'border-primary bg-primary/[0.07] text-primary ring-2 ring-primary/10' : 'border-border bg-card hover:border-primary/25 hover:bg-muted/50')}><span>{level}</span>{criticality === level && <Check className="size-4" />}</button>)}
            </div>
          </div>
          <Field label="Required by date"><Input type="date" defaultValue="2026-11-10" className="h-10 rounded-xl" /></Field>
          <Field label="Planned maintenance date"><Input type="date" defaultValue="2026-11-15" className="h-10 rounded-xl" /></Field>
          <Field label="Planned outage start"><Input type="date" defaultValue="2026-11-14" className="h-10 rounded-xl" /></Field>
          <Field label="Planned outage end"><Input type="date" defaultValue="2026-11-18" className="h-10 rounded-xl" /></Field>
          <Field label="Requested by"><Input defaultValue="Ahmed Rahman · Maintenance Planner" className="h-10 rounded-xl" /></Field>
          <Field label="Work order"><Input defaultValue="WO-2026-2148" className="h-10 rounded-xl" /></Field>
          <Field label="Notes" className="sm:col-span-2"><Textarea placeholder="Add supporting context for engineering, inventory or procurement…" className="min-h-24 rounded-xl" /></Field>
        </CardContent>
      </Card>
      </fieldset>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/92 px-4 py-3 backdrop-blur-xl lg:left-[272px]">
        <div className="mx-auto flex max-w-[1416px] items-center justify-between gap-3">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><CalendarDays className="size-4" />Required before 10 Nov 2026</div>
          <div className="grid w-full grid-cols-2 gap-2 sm:ml-auto sm:flex sm:w-auto">
            <Button className="w-full sm:w-auto" variant="ghost" onClick={() => router.push('/spares')}>Cancel</Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => requirePermission(() => setDraftSaved(true))}>{allowed ? <Save data-icon="inline-start" /> : <LockKeyhole data-icon="inline-start" />}Save Draft</Button>
            <Button className="col-span-2 w-full sm:w-auto" onClick={() => requirePermission(() => setConfirmOpen(true))}>{allowed ? <ClipboardPlus data-icon="inline-start" /> : <LockKeyhole data-icon="inline-start" />}Create Critical Spare Request</Button>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6">
          <DialogHeader><DialogTitle className="text-xl font-semibold">Create critical spare request?</DialogTitle><DialogDescription>This starts a shared decision workspace for the plant teams.</DialogDescription></DialogHeader>
          <div className="rounded-xl border border-border bg-muted/45 p-4">
            <p className="font-semibold">Mechanical Seal</p><p className="mt-1 text-sm text-muted-foreground">Cooling Water Pump P-201 · Unit 2</p>
            <div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={criticality} /><StatusBadge status="Required before 10 Nov 2026" tone="info" /></div>
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button onClick={() => router.push('/spares/CSR-2026-014')}>Create Request</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-2 block text-sm font-semibold">{label}</Label>{children}</div>
}

'use client'

import * as React from 'react'
import { Eye, Hourglass, LockKeyhole, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDecisionState } from '@/lib/app-providers'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePermissionAction } from '@/components/permission-action'

export function PhysicalVerificationAction({ requestId }: { requestId: string }) {
  const { state, requestPhysicalVerification } = useDecisionState(requestId)
  const [requestOpen,setRequestOpen]=React.useState(false)
  const [allocationOpen,setAllocationOpen]=React.useState(false)
  const requested = state.physicalVerificationStatus === 'Verification Requested'
  const { allowed, requirePermission } = usePermissionAction('request-verification')
  return <>
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-warning/25 bg-warning/[0.08] p-4"><div><p className="text-sm font-semibold">Reserved for Unit 1 Overhaul · WO-1843</p><p className="mt-1 text-sm text-muted-foreground">One serviceable unit is physically recorded, but none is currently available for this request.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={()=>setAllocationOpen(true)}><Eye data-icon="inline-start" />View Allocation</Button>{requested?<span className="flex items-center gap-2 rounded-full bg-info/10 px-3 py-2 text-sm font-semibold text-info"><Hourglass className="size-4" />Verification Requested</span>:<Button size="sm" onClick={()=>requirePermission(()=>setRequestOpen(true))}>{allowed ? <Search data-icon="inline-start" /> : <LockKeyhole data-icon="inline-start" />}Request Physical Verification</Button>}</div></div>
    <Dialog open={allocationOpen} onOpenChange={setAllocationOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-lg"><DialogHeader><DialogTitle className="text-xl font-semibold">Reserved stock allocation</DialogTitle><DialogDescription>Main Warehouse · Mechanical Seal MS-420</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-3">{[['Work order','WO-1843'],['Equipment','Pump P-101'],['Planned use','20 November 2026'],['Allocated by','Stores Supervisor'],['Condition','Serviceable'],['Last movement','18 March 2024']].map(([l,v])=><div key={l} className="rounded-xl bg-muted/45 p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-1 text-sm font-semibold">{v}</p></div>)}</div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button onClick={()=>setAllocationOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={requestOpen} onOpenChange={setRequestOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-xl"><DialogHeader><DialogTitle className="text-xl font-semibold">Request physical verification</DialogTitle><DialogDescription>Ask the technical and stores teams to verify the installed and reserved units.</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><Field label="Reason" className="sm:col-span-2"><Textarea defaultValue="Confirm the exact installed Rev. C configuration and condition of the reserved seal before compatibility is finalized." className="min-h-24 rounded-xl" /></Field><Field label="Proposed date"><Input type="date" defaultValue="2026-10-06" className="h-10 rounded-xl" /></Field><Field label="Shutdown required"><Select defaultValue="potentially"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Potentially required</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="potentially">Potentially required</SelectItem><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectGroup></SelectContent></Select></Field><Field label="Assigned technical owner" className="sm:col-span-2"><Select defaultValue="sarah"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Sarah Malik · Reliability Engineering</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="sarah">Sarah Malik · Reliability Engineering</SelectItem><SelectItem value="engineering">Engineering Team</SelectItem></SelectGroup></SelectContent></Select></Field></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={()=>setRequestOpen(false)}>Cancel</Button><Button onClick={()=>{requestPhysicalVerification();setRequestOpen(false)}}>Save Verification Request</Button></DialogFooter></DialogContent></Dialog>
  </>
}
function Field({label,children,className}:{label:string;children:React.ReactNode;className?:string}){return <div className={className}><Label className="mb-2 block text-sm font-semibold">{label}</Label>{children}</div>}

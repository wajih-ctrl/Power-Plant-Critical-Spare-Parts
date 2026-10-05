'use client'

import * as React from 'react'
import { CircleCheck, CircleHelp, Info, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDecisionState } from '@/lib/app-providers'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { usePermissionAction } from '@/components/permission-action'

export function CompatibilityConfirmation({ requestId }: { requestId: string }) {
  const { state, confirmCompatibility } = useDecisionState(requestId)
  const [confirmOpen,setConfirmOpen] = React.useState(false)
  const [infoOpen,setInfoOpen] = React.useState(false)
  const [infoRequested,setInfoRequested] = React.useState(false)
  const isValidated = state.compatibility === 'Validated'
  const { allowed, requirePermission } = usePermissionAction('validate-technical')

  return <div className="flex flex-col gap-3">
    <div className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${isValidated?'border-success/25 bg-success/10':'border-warning/30 bg-warning/[0.08]'}`}>
      <div><p className="text-sm font-semibold">{isValidated?'Compatibility validated':'Engineering sign-off required'}</p><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{isValidated?'Engineering confirmed MS-421B for Pump P-201 Rev. C. The technical validation step is complete.':'Confirm the OEM replacement against the installed Rev. C configuration before commercial action.'}</p></div>
      {isValidated ? <span className="flex items-center gap-2 font-semibold text-success"><CircleCheck className="size-5" />Validated</span> : <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={()=>requirePermission(()=>setInfoOpen(true))}>{allowed ? <CircleHelp data-icon="inline-start" /> : <LockKeyhole data-icon="inline-start" />}Needs More Information</Button><Button onClick={()=>requirePermission(()=>setConfirmOpen(true))}>{!allowed && <LockKeyhole data-icon="inline-start" />}Mark Compatibility Confirmed</Button></div>}
    </div>
    {infoRequested && <div className="flex items-start gap-3 rounded-xl border border-info/25 bg-info/10 p-4"><Info className="mt-0.5 size-4.5 shrink-0 text-info" /><div><p className="text-sm font-semibold">Additional information requested</p><p className="mt-1 text-sm text-muted-foreground">Engineering requested the installed seal-chamber drawing and shaft measurement before validation.</p></div></div>}
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-md"><DialogHeader><DialogTitle className="text-xl font-semibold">Confirm technical compatibility?</DialogTitle><DialogDescription>This records MS-421B as compatible with Cooling Water Pump P-201 Rev. C for this prototype request.</DialogDescription></DialogHeader><div className="rounded-xl border border-success/25 bg-success/10 p-4 text-sm"><strong>MS-420 → MS-421B</strong><p className="mt-1 text-muted-foreground">OEM replacement reference and installed configuration reviewed.</p></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={()=>setConfirmOpen(false)}>Cancel</Button><Button onClick={()=>{confirmCompatibility();setConfirmOpen(false)}}>Confirm Compatibility</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={infoOpen} onOpenChange={setInfoOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-lg"><DialogHeader><DialogTitle className="text-xl font-semibold">Request more information</DialogTitle><DialogDescription>Describe what engineering needs before compatibility can be confirmed.</DialogDescription></DialogHeader><div><Label className="mb-2 block text-sm font-semibold">Outstanding information</Label><Textarea defaultValue="Provide the installed seal-chamber drawing and confirm shaft dimensions for Pump P-201 Rev. C." className="min-h-28 rounded-xl" /></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={()=>setInfoOpen(false)}>Cancel</Button><Button onClick={()=>{setInfoRequested(true);setInfoOpen(false)}}>Request Information</Button></DialogFooter></DialogContent></Dialog>
  </div>
}

'use client'

import Link from 'next/link'
import { Check, ClipboardCheck, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDecisionState } from '@/lib/app-providers'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { usePermissionAction } from '@/components/permission-action'

export function ApprovalActions({ requestId }: { requestId: string }) {
  const { state, markManagementReviewReady } = useDecisionState(requestId)
  const { allowed, requirePermission } = usePermissionAction('prepare-management-review')
  if(state.managementReviewReady) return <div className="flex w-full items-start gap-3 rounded-xl border border-success/25 bg-success/10 p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground"><Check className="size-4.5" /></span><div><p className="font-semibold text-success">Management Review Ready</p><p className="mt-1 text-sm text-muted-foreground">Technical and commercial inputs have been compiled for management review.</p></div></div>
  return <div className="flex w-full flex-wrap items-center gap-2">
    <Button variant="outline" render={<Link href={`/spares/${requestId}/technical-validation`} />} nativeButton={false}>Return to Technical Validation</Button>
    <Button variant="outline" render={<Link href={`/spares/${requestId}/suppliers`} />} nativeButton={false}>Review Supplier B</Button>
    <Button variant="outline" render={<Link href={`/spares/${requestId}/inventory-maintenance`} />} nativeButton={false}>Review Reserved Stock</Button>
    {allowed ? <AlertDialog><AlertDialogTrigger render={<Button className="ml-auto" />}><ClipboardCheck data-icon="inline-start" />Mark Ready for Management Review</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Mark this request ready?</AlertDialogTitle><AlertDialogDescription>This records that the technical, inventory, commercial and risk inputs have been compiled for management review. It does not approve a purchase.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={markManagementReviewReady}>Mark Ready for Review</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> : <Button className="ml-auto" onClick={()=>requirePermission(markManagementReviewReady)}><LockKeyhole data-icon="inline-start" />Mark Ready for Management Review</Button>}
  </div>
}

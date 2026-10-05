import { notFound } from 'next/navigation'
import { AlertTriangle, FileText, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { Separator } from '@/components/ui/separator'
import { CompatibilityConfirmation } from '@/components/request/compatibility-confirmation'
import { TechnicalDocumentList } from '@/components/request/technical-document-list'
import { PhysicalVerificationAction } from '@/components/request/physical-verification-action'
import { getRequestById } from '@/lib/mock-data'
import { RoleAccessBanner } from '@/components/role-access-banner'

export default async function TechnicalValidationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Technical validation</h2><p className="mt-1 text-sm text-muted-foreground">Confirm the correct spare reference and compatibility with the installed equipment.</p></div>
      <RoleAccessBanner permission="validate-technical" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['Request',request.id],['Equipment',request.equipment],['Internal reference',request.partNumberFrom],['OEM replacement',request.partNumberTo],['Validation status','Pending']].map(([label,value])=><div key={label} className="rounded-xl border border-border bg-card p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div>
      <div className="flex items-start gap-3 rounded-2xl border border-warning/35 bg-warning/[0.08] p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground"><AlertTriangle className="size-4.5" /></span><div><p className="font-semibold">Obsolete reference detected</p><p className="mt-1 text-sm text-muted-foreground">Internal records still reference <strong className="text-foreground">MS-420</strong>. The current OEM reference is <strong className="text-foreground">MS-421B</strong>.</p></div></div>
      <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-warning/30 bg-warning/[0.07] p-4"><p className="text-xs font-medium text-muted-foreground">Physical verification required</p><div className="mt-2 flex items-center justify-between"><p className="font-semibold">Potentially Yes</p><StatusBadge status="Needs Review" /></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Installed configuration may require visual inspection or limited dismantling.</p></div><div className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">Equipment shutdown required</p><div className="mt-2 flex items-center justify-between"><p className="font-semibold">Not Confirmed</p><StatusBadge status="Pending Confirmation" /></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Coordinate with Operations before scheduling an inspection.</p></div><div className="rounded-xl border border-warning/30 bg-warning/[0.07] p-4"><p className="text-xs font-medium text-muted-foreground">Validation status</p><div className="mt-2 flex items-center justify-between"><p className="font-semibold">Pending</p><StatusBadge status="Validation Pending" /></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">OEM replacement is identified; Rev. C compatibility remains open.</p></div></div>
      <Card>
        <CardHeader>
          <CardTitle>Part Reference Comparison</CardTitle>
          <CardDescription>
            Internal CMMS record vs. OEM-confirmed reference for {request.equipment}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  CMMS Record
                </span>
                <StatusBadge status="Obsolete" />
              </div>
              <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                {request.partNumberFrom}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last confirmed 18 Mar 2024 — no longer manufactured by OEM.
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  OEM-Confirmed Replacement
                </span>
                <StatusBadge status="Validation Pending" />
              </div>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                {request.partNumberTo}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Per OEM Bulletin SB-2024-018. Compatibility with Pump P-201 Rev. C not yet confirmed.
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="mb-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-muted/45 p-3"><p className="text-xs text-muted-foreground">Model</p><p className="mt-1 font-semibold">CWP-900</p></div><div className="rounded-xl bg-muted/45 p-3"><p className="text-xs text-muted-foreground">Configuration</p><p className="mt-1 font-semibold">Rev. C</p></div><div className="rounded-xl bg-muted/45 p-3"><p className="text-xs text-muted-foreground">Configuration match</p><p className="mt-1 font-semibold">Not yet confirmed</p></div></div>
          <CompatibilityConfirmation requestId={id} />
          <div className="mt-3"><PhysicalVerificationAction requestId={id} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            Supporting Documentation
          </CardTitle>
          <CardDescription>Source documents used to validate this reference</CardDescription>
        </CardHeader>
        <CardContent><TechnicalDocumentList /></CardContent>
      </Card>
    </div>
  )
}

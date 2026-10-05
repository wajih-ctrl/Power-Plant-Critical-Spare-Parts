import { notFound } from 'next/navigation'
import { Gauge } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { getRequestById, RISK_FACTORS } from '@/lib/mock-data'

const LEVEL_WEIGHT: Record<string, number> = { High: 100, Medium: 60, Potential: 40, Low: 20 }

export default async function RiskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Operational risk</h2><p className="mt-1 text-sm text-muted-foreground">Understand potential plant impact if the spare is not available when required.</p></div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Gauge className="size-4 text-muted-foreground" />
            Overall Operational Risk
          </CardTitle>
          <CardDescription>
            Based on equipment criticality, maintenance timing and delivery outlook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-5 rounded-xl border border-destructive/20 bg-destructive/[0.045] p-5">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-destructive">Overall risk</p><p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-destructive">HIGH</p></div>
            <p className="max-w-3xl text-[15px] leading-relaxed text-foreground">The approved OEM supplier cannot deliver before the planned maintenance window, while the faster alternative still requires technical qualification.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Risk Factors</CardTitle>
          <CardDescription>Weighted by operational impact if this request remains unresolved</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {RISK_FACTORS.map((risk) => (
            <div key={risk.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{risk.title}</span>
                <StatusBadge status={risk.level} />
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${LEVEL_WEIGHT[risk.level] ?? 20}%` }}
                />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{risk.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Risk timeline</CardTitle><CardDescription>Critical milestones and unresolved inputs.</CardDescription></CardHeader><CardContent><div className="grid gap-2 sm:grid-cols-5">{[['Now','Technical validation pending'],['10 Nov','Part required'],['14–18 Nov','Unit 2 outage'],['15 Nov','Pump maintenance'],['Beyond window','OEM delivery']].map(([date,label],index)=><div key={label} className="relative rounded-xl border border-border bg-muted/30 p-3"><span className={`mb-3 flex size-7 items-center justify-center rounded-full text-xs font-semibold ${index===4?'bg-destructive/10 text-destructive':'bg-primary/10 text-primary'}`}>{index+1}</span><p className="text-xs font-semibold text-muted-foreground">{date}</p><p className="mt-1 text-sm font-semibold">{label}</p></div>)}</div></CardContent></Card>
    </div>
  )
}

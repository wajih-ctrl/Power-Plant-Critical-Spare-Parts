import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { getRequestById, DATA_CONFLICTS } from '@/lib/mock-data'

export default async function ConflictsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  return (
    <div className="flex flex-col gap-4">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Data conflict alerts</h2>
      <p className="text-sm text-muted-foreground">
        Discrepancies found across CMMS, OEM, commercial and inventory sources for {request.spare}.
      </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Active Conflicts','6'],['High Priority','4'],['Require Technical Review','3'],['Commercial Data Issue','1']].map(([label,value])=><div key={label} className="rounded-xl border border-border bg-card p-3"><p className="text-2xl font-semibold tabular">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {DATA_CONFLICTS.map((conflict) => (
          <Card key={conflict.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm">{conflict.title}</CardTitle>
                <StatusBadge status={conflict.severity} />
              </div>
              <CardDescription>{conflict.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-foreground">{conflict.description}</p>
              {conflict.sourceA && conflict.sourceB && (
                <div className="flex items-center gap-2 rounded-md bg-muted/60 p-2.5 text-xs">
                  <div className="flex flex-1 flex-col">
                    <span className="text-muted-foreground">{conflict.sourceA.label}</span>
                    <span className="font-mono font-medium text-foreground">{conflict.sourceA.value}</span>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-1 flex-col text-right">
                    <span className="text-muted-foreground">{conflict.sourceB.label}</span>
                    <span className="font-mono font-medium text-foreground">{conflict.sourceB.value}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={conflict.status} />
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/spares/${id}/${
                        conflict.actionTarget === 'technical' ? 'technical-validation' : conflict.actionTarget === 'inventory' ? 'inventory-maintenance' : conflict.actionTarget
                      }`}
                    />
                  }
                >
                  {conflict.actionLabel}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

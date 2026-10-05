import { notFound } from 'next/navigation'
import { Boxes, CalendarClock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/status-badge'
import { PhysicalVerificationAction } from '@/components/request/physical-verification-action'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getRequestById, UPCOMING_MAINTENANCE, CONSUMPTION_HISTORY } from '@/lib/mock-data'
import { RoleAccessBanner } from '@/components/role-access-banner'

export default async function InventoryMaintenancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  const totalPhysical = request.stockAvailable + request.stockReserved
  const availablePct = totalPhysical > 0 ? Math.round((request.stockAvailable / totalPhysical) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Inventory & maintenance</h2><p className="mt-1 text-sm text-muted-foreground">Review usable stock and confirm whether the spare can support the planned maintenance window.</p></div>
      <RoleAccessBanner permission="request-verification" />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Boxes className="size-4 text-muted-foreground" />
            Stock Position
          </CardTitle>
          <CardDescription>Physical stock, reservations and inbound orders</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <span className="text-xs text-muted-foreground">Usable Stock</span>
              <p className="mt-1 text-2xl font-semibold tabular text-foreground">{request.stockAvailable}</p>
              {request.stockAvailable === 0 && <StatusBadge status="No Available Stock" className="mt-2" />}
            </div>
            <div className="rounded-lg border border-border p-4">
              <span className="text-xs text-muted-foreground">Reserved</span>
              <p className="mt-1 text-2xl font-semibold tabular text-foreground">{request.stockReserved}</p>
              {request.stockReserved > 0 && <StatusBadge status="Reserved" className="mt-2" />}
            </div>
            <div className="rounded-lg border border-border p-4">
              <span className="text-xs text-muted-foreground">In Transit</span>
              <p className="mt-1 text-2xl font-semibold tabular text-foreground">{request.stockInTransit}</p>
              {request.stockInTransit > 0 && <StatusBadge status="In Transit" className="mt-2" />}
            </div>
          </div>

          {totalPhysical > 0 && (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Usable of physical stock</span>
                <span className="tabular">{availablePct}%</span>
              </div>
              <Progress value={availablePct} />
            </div>
          )}

          {request.stockReserved > 0 && <PhysicalVerificationAction requestId={id} />}
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Stock details</CardTitle><CardDescription>Physical position, allocation and condition.</CardDescription></CardHeader><CardContent className="overflow-x-auto px-0"><Table><TableHeader><TableRow><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead>Quantity</TableHead><TableHead>Allocation</TableHead><TableHead>Last Movement</TableHead><TableHead>Condition</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell className="font-semibold">Main Warehouse</TableCell><TableCell><StatusBadge status="Reserved" /></TableCell><TableCell>1</TableCell><TableCell>Unit 1 Overhaul · WO-1843</TableCell><TableCell>18 Mar 2024</TableCell><TableCell><StatusBadge status="Serviceable" tone="success" /></TableCell></TableRow></TableBody></Table></CardContent></Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarClock className="size-4 text-muted-foreground" />
              Maintenance Schedule
            </CardTitle>
            <CardDescription>{request.equipment} · {request.unit}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {UPCOMING_MAINTENANCE.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{item.date}</span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
            ))}
            <div className="mt-2 border-t border-border pt-3"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Maintenance history</p><div className="flex items-center justify-between text-sm"><span>Previous seal service</span><span className="font-semibold">18 Mar 2024</span></div><div className="mt-2 flex items-center justify-between text-sm"><span>Previous Unit 2 overhaul</span><span className="font-semibold">Nov 2023</span></div></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Historical Consumption</CardTitle>
            <CardDescription>
              {request.spare} usage against {request.equipment}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {CONSUMPTION_HISTORY.map((item) => (
              <div key={item.year} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.year}</span>
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card><CardHeader><CardTitle>Delivery and maintenance window</CardTitle><CardDescription>Supplier timing compared with the 10 November required date.</CardDescription></CardHeader><CardContent><div className="relative overflow-hidden rounded-xl border border-border bg-muted/25 p-4 sm:p-5"><div className="absolute bottom-5 left-[56%] top-5 hidden w-px bg-destructive/50 sm:block" /><div className="absolute bottom-5 right-[24%] top-5 hidden w-px bg-primary/30 sm:block" /><div className="space-y-4">{[['Supplier B · 5 weeks','42%','bg-success'],['Supplier C · 8 weeks','61%','bg-warning'],['OEM · 14 weeks','96%','bg-destructive']].map(([label,width,color])=><div key={label} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-3"><span className="text-sm font-semibold">{label}</span><div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${color}`} style={{width}} /></div></div>)}</div><div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:flex sm:justify-between sm:pl-[162px]"><span>Today</span><span className="font-semibold text-destructive">10 Nov · Required</span><span>14–18 Nov · Outage</span><span>Beyond window</span></div></div></CardContent></Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{['Maintenance Delay','Equipment Availability Risk','Potential Outage Extension','Production Impact'].map((item,index)=><div key={item} className="rounded-xl border border-border bg-card p-4"><p className="text-sm font-semibold">{item}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{index<2?'High attention required before the maintenance window.':'Potential impact if the spare remains unavailable.'}</p></div>)}</div>
    </div>
  )
}

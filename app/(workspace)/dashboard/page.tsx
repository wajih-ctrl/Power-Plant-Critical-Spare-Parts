'use client'

import Link from 'next/link'
import { AlertTriangle, CalendarClock, ChevronRight, ClipboardCheck, History, LockKeyhole, PackageX, Plus, ShieldAlert, Sparkles, Timer, Wrench } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DASHBOARD_METRICS,
  SPARE_REQUESTS,
  UPCOMING_MAINTENANCE,
  CONSUMPTION_HISTORY,
} from '@/lib/mock-data'
import { usePermissionAction } from '@/components/permission-action'
import { useRole } from '@/lib/app-providers'
import { ROLE_WORKSPACES } from '@/lib/role-workspace'

export default function DashboardPage() {
  const { role } = useRole()
  const roleWorkspace = ROLE_WORKSPACES[role]
  const attentionRequests = role === 'inventory'
    ? SPARE_REQUESTS.filter(request => request.stockAvailable === 0).slice(0, 4)
    : role === 'engineering'
      ? SPARE_REQUESTS.filter(request => request.technicalStatus !== 'Validated').slice(0, 4)
      : role === 'management' || role === 'operations'
        ? SPARE_REQUESTS.filter(request => request.risk !== 'Low').slice(0, 4)
        : SPARE_REQUESTS.slice(0, 4)
  const metricIcons = [ClipboardCheck, Wrench, AlertTriangle, PackageX, Timer, ShieldAlert]
  const metricTargets = ['/spares', '/spares?focus=technical', '/spares?focus=obsolete', '/spares?focus=stock', '/spares?focus=lead-time', '/spares?focus=risk']
  const { allowed: canCreate, requirePermission } = usePermissionAction('create-request')

  return (
    <div className="flex flex-col gap-7">
      <section className="decision-hero relative overflow-hidden rounded-[1.4rem] px-5 py-6 text-white shadow-[0_22px_55px_rgba(10,27,58,.2)] sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-28 -top-32 size-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-200"><span className="h-px w-6 bg-blue-300/60" />Role-focused workspace</div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{roleWorkspace.title}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-white/55">{roleWorkspace.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">{roleWorkspace.insightBadges.map((badge,index)=><span key={badge} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${index===0?'border-red-300/15 bg-red-400/10 text-red-100':index===1?'border-amber-300/15 bg-amber-300/10 text-amber-100':'border-white/10 bg-white/[0.07] text-white/75'}`}>{badge}</span>)}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-right sm:block"><p className="text-xs font-medium text-white/45">Next planned outage</p><p className="mt-0.5 text-sm font-semibold text-white">14–18 Nov 2026</p></div>
            {canCreate ? <Button className="bg-white text-slate-900 shadow-none hover:bg-blue-50" render={<Link href="/spares/new" />} nativeButton={false}><Plus data-icon="inline-start" />New Critical Spare Request</Button> : <Button className="bg-white text-slate-900 shadow-none hover:bg-blue-50" onClick={()=>requirePermission(()=>{})}><LockKeyhole data-icon="inline-start" />New Critical Spare Request</Button>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:p-5"><div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><div><h2 className="text-sm font-semibold">Recommended for your role</h2><p className="text-xs text-muted-foreground">The most relevant next actions for this workspace.</p></div></div><div className="grid gap-3 lg:grid-cols-3">{roleWorkspace.quickActions.map(action=><Link key={action.label} href={action.href} className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"><div className="min-w-0"><p className="text-sm font-semibold">{action.label}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{action.detail}</p></div><ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" /></Link>)}</div></section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {roleWorkspace.metricOrder.map((index) => {
          const metric = DASHBOARD_METRICS[index]
          const Icon = metricIcons[index]
          const urgent = index === 0 || index === 3 || index === 4
          return (
          <Link key={metric.label} href={metricTargets[index]} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <Card className="relative h-full gap-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:shadow-[0_12px_30px_rgba(15,23,42,.08)]">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/80 via-primary/20 to-transparent" />
            <CardHeader className="grid-cols-[1fr_auto] items-center pb-0">
              <CardDescription className="font-medium">{metric.label}</CardDescription>
              <span className={`flex size-9 items-center justify-center rounded-xl ${urgent ? 'bg-destructive/8 text-destructive' : 'bg-primary/8 text-primary'}`}>
                <Icon className="size-[18px]" />
              </span>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3 pt-0">
              <span className="text-[2.25rem] font-semibold leading-none tabular tracking-[-0.05em] text-foreground">
                {metric.value}
              </span>
              <span className="flex max-w-[12rem] items-center gap-1 text-right text-xs leading-relaxed text-muted-foreground">{metric.context}<ChevronRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" /></span>
            </CardContent>
          </Card>
          </Link>
        )})}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto]">
            <div>
              <CardTitle className="text-lg">Requests needing attention</CardTitle>
              <CardDescription className="mt-1">Prioritized by decision risk and required date</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/spares" />} nativeButton={false}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {attentionRequests.map((request, index) => (
              <Link
                key={request.id}
                href={`/spares/${request.id}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-3.5 transition-all hover:border-border hover:bg-muted/45"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/8 text-xs font-semibold tabular text-destructive">0{index + 1}</span>
                  <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-semibold text-foreground">{request.spare}</span>
                    <span className="text-xs font-medium text-muted-foreground">{request.id}</span>
                  </div>
                  <span className="truncate text-sm text-muted-foreground">
                    {request.equipment} · {request.unit} · {request.reason}
                  </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2"><StatusBadge status={request.risk} /><span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex">Review <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="bg-[linear-gradient(145deg,var(--card),color-mix(in_oklch,var(--primary)_5%,var(--card)))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarClock className="size-4" /></span>
                Upcoming Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {UPCOMING_MAINTENANCE.map((item) => (
                <Link href="/spares/CSR-2026-014/inventory-maintenance" key={item.label} className="group flex items-center gap-3 rounded-xl bg-background/55 px-3 py-2.5 transition-colors hover:bg-primary/[0.07]">
                  <span className="w-16 shrink-0 text-xs font-semibold text-primary">{item.date}</span>
                  <span className="h-7 w-px shrink-0 bg-border" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span><ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><History className="size-4" /></span>
                Recent Consumption
              </CardTitle>
              <CardDescription>Mechanical Seal MS-420 / MS-421B</CardDescription>
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
      </div>

      <Card>
        <CardHeader className="grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto]">
          <div><CardTitle className="text-lg">Recent requests</CardTitle><CardDescription className="mt-1">Current spare requirements across plant equipment</CardDescription></div>
          <Button variant="ghost" size="sm" render={<Link href="/spares" />} nativeButton={false}>View all requests</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table>
            <TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Spare</TableHead><TableHead>Equipment</TableHead><TableHead>Status</TableHead><TableHead>Stock</TableHead><TableHead>Required</TableHead><TableHead>Lead time</TableHead><TableHead>Risk</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>{SPARE_REQUESTS.map((request) => <TableRow key={request.id}><TableCell className="font-semibold text-primary">{request.id}</TableCell><TableCell className="font-semibold">{request.spare}</TableCell><TableCell><span className="block">{request.equipment}</span><span className="text-xs text-muted-foreground">{request.unit}</span></TableCell><TableCell><StatusBadge status={request.overallStatus} /></TableCell><TableCell className="tabular">{request.stockAvailable} available</TableCell><TableCell>{new Date(request.requiredDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</TableCell><TableCell>{request.leadTimeWeeks} weeks</TableCell><TableCell><StatusBadge status={request.risk} /></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" render={<Link href={`/spares/${request.id}`} />} nativeButton={false}>Open</Button></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

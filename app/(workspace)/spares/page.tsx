'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bookmark, Boxes, CircleAlert, Filter, Gauge, ListChecks, LockKeyhole, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SPARE_REQUESTS } from '@/lib/mock-data'
import type { Criticality, OverallStatus } from '@/lib/types'
import { usePermissionAction } from '@/components/permission-action'

type AdvancedFilterKey = 'technical' | 'obsolete' | 'stock' | 'supplier' | 'qualification' | 'leadTime' | 'maintenance' | 'openPo' | 'risk'
type AdvancedFilters = Record<AdvancedFilterKey, string>

const EMPTY_ADVANCED_FILTERS: AdvancedFilters = {
  technical: 'all',
  obsolete: 'all',
  stock: 'all',
  supplier: 'all',
  qualification: 'all',
  leadTime: 'all',
  maintenance: 'all',
  openPo: 'all',
  risk: 'all',
}

const ADVANCED_FILTER_CONFIG: Array<{ key: AdvancedFilterKey; label: string; options: Array<{ value: string; label: string }> }> = [
  { key: 'technical', label: 'Technical status', options: [{ value: 'needs-review', label: 'Needs review' }, { value: 'validated', label: 'Validated' }] },
  { key: 'obsolete', label: 'Obsolete reference', options: [{ value: 'yes', label: 'Obsolete only' }, { value: 'no', label: 'Current references only' }] },
  { key: 'stock', label: 'Stock status', options: [{ value: 'unavailable', label: 'No usable stock' }, { value: 'reserved', label: 'Reserved stock' }, { value: 'in-transit', label: 'In transit' }, { value: 'available', label: 'Available' }] },
  { key: 'supplier', label: 'Supplier', options: [{ value: 'oem', label: 'OEM Supplier' }, { value: 'supplier-b', label: 'Supplier B' }, { value: 'supplier-c', label: 'Supplier C' }] },
  { key: 'qualification', label: 'Supplier qualification', options: [{ value: 'pending', label: 'Pending qualification' }, { value: 'approved', label: 'Approved' }] },
  { key: 'leadTime', label: 'Lead-time risk', options: [{ value: 'risk', label: 'At risk · 8+ weeks' }, { value: 'on-track', label: 'Under 8 weeks' }] },
  { key: 'maintenance', label: 'Maintenance date', options: [{ value: 'before-nov-15', label: 'Before 15 Nov 2026' }, { value: 'november', label: 'November 2026' }, { value: 'later', label: 'December 2026 or later' }] },
  { key: 'openPo', label: 'Open PO', options: [{ value: 'yes', label: 'Open PO exists' }, { value: 'no', label: 'No open PO' }] },
  { key: 'risk', label: 'Operational risk', options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
]

export default function CriticalSparesPage() {
  return <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">Loading decision pipeline…</div>}><CriticalSparesContent /></Suspense>
}

function CriticalSparesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const focus = searchParams.get('focus')
  const [query, setQuery] = React.useState('')
  const [criticality, setCriticality] = React.useState<Criticality | 'all'>('all')
  const [status, setStatus] = React.useState<OverallStatus | 'all'>('all')
  const [unit, setUnit] = React.useState('all')
  const [advancedOpen, setAdvancedOpen] = React.useState(false)
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilters>(EMPTY_ADVANCED_FILTERS)
  const [advancedDraft, setAdvancedDraft] = React.useState<AdvancedFilters>(EMPTY_ADVANCED_FILTERS)
  const [saveOpen, setSaveOpen] = React.useState(false)
  const [savedView, setSavedView] = React.useState('')
  const [viewName, setViewName] = React.useState('High-priority Unit 2 requests')
  const { allowed: canCreate, requirePermission } = usePermissionAction('create-request')

  const filtered = SPARE_REQUESTS.filter((r) => {
    const supplierIds = r.id === 'CSR-2026-014' ? ['oem', 'supplier-b', 'supplier-c'] : r.id === 'CSR-2026-009' ? ['supplier-c'] : ['oem']
    const qualifications = r.id === 'CSR-2026-014' || r.technicalStatus !== 'Validated' ? ['approved', 'pending'] : ['approved']
    const matchesQuery = !query.trim() || [r.id, r.spare, r.equipment, r.partNumberFrom, r.partNumberTo].join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesFocus = !focus ||
      (focus === 'technical' && r.technicalStatus !== 'Validated') ||
      (focus === 'obsolete' && r.partNumberFrom !== r.partNumberTo) ||
      (focus === 'stock' && r.stockAvailable === 0) ||
      (focus === 'lead-time' && r.leadTimeWeeks >= 8) ||
      (focus === 'risk' && r.risk === 'High')
    const matchesAdvanced =
      (advancedFilters.technical === 'all' || (advancedFilters.technical === 'validated' ? r.technicalStatus === 'Validated' : r.technicalStatus !== 'Validated')) &&
      (advancedFilters.obsolete === 'all' || (advancedFilters.obsolete === 'yes' ? r.partNumberFrom !== r.partNumberTo : r.partNumberFrom === r.partNumberTo)) &&
      (advancedFilters.stock === 'all' ||
        (advancedFilters.stock === 'available' && r.stockAvailable > 0) ||
        (advancedFilters.stock === 'unavailable' && r.stockAvailable === 0) ||
        (advancedFilters.stock === 'reserved' && r.stockReserved > 0) ||
        (advancedFilters.stock === 'in-transit' && r.stockInTransit > 0)) &&
      (advancedFilters.supplier === 'all' || supplierIds.includes(advancedFilters.supplier)) &&
      (advancedFilters.qualification === 'all' || qualifications.includes(advancedFilters.qualification)) &&
      (advancedFilters.leadTime === 'all' || (advancedFilters.leadTime === 'risk' ? r.leadTimeWeeks >= 8 : r.leadTimeWeeks < 8)) &&
      (advancedFilters.maintenance === 'all' ||
        (advancedFilters.maintenance === 'before-nov-15' && r.requiredDate <= '2026-11-15') ||
        (advancedFilters.maintenance === 'november' && r.requiredDate.startsWith('2026-11')) ||
        (advancedFilters.maintenance === 'later' && r.requiredDate >= '2026-12-01')) &&
      (advancedFilters.openPo === 'all' || (advancedFilters.openPo === 'yes' ? r.stockInTransit > 0 : r.stockInTransit === 0)) &&
      (advancedFilters.risk === 'all' || r.risk.toLowerCase() === advancedFilters.risk)
    return matchesQuery && matchesFocus && matchesAdvanced && (criticality === 'all' || r.criticality === criticality) && (status === 'all' || r.overallStatus === status) && (unit === 'all' || r.unit === unit)
  })
  const clearFilters = () => { setQuery(''); setCriticality('all'); setStatus('all'); setUnit('all'); setAdvancedFilters(EMPTY_ADVANCED_FILTERS); setAdvancedDraft(EMPTY_ADVANCED_FILTERS); router.replace('/spares') }
  const activeFilters = [criticality !== 'all' ? criticality : null, status !== 'all' ? status : null, unit !== 'all' ? unit : null].filter(Boolean) as string[]
  const activeAdvancedFilters = ADVANCED_FILTER_CONFIG.flatMap((filter) => {
    const value = advancedFilters[filter.key]
    if (value === 'all') return []
    return [{ key: filter.key, label: `${filter.label}: ${filter.options.find((option) => option.value === value)?.label ?? value}` }]
  })
  const pipelineTiles = [
    { label: 'Visible requests', value: SPARE_REQUESTS.length, detail: 'Across all units', href: '/spares', icon: ListChecks },
    { label: 'Technical review', value: SPARE_REQUESTS.filter(r=>r.technicalStatus!=='Validated').length, detail: 'Requires engineering', href: '/spares?focus=technical', icon: CircleAlert },
    { label: 'No usable stock', value: SPARE_REQUESTS.filter(r=>r.stockAvailable===0).length, detail: 'Inventory constraint', href: '/spares?focus=stock', icon: Boxes },
    { label: 'High operational risk', value: SPARE_REQUESTS.filter(r=>r.risk==='High').length, detail: 'Immediate attention', href: '/spares?focus=risk', icon: Gauge },
  ]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"><span className="h-px w-6 bg-primary/60" />Decision pipeline</div><h1 className="text-3xl font-semibold tracking-[-0.035em]">Critical spare requests</h1><p className="mt-2 text-[15px] text-muted-foreground">Track, review and resolve spare requirements across plant equipment.</p></div>
        {canCreate ? <Button className="w-full sm:w-auto" render={<Link href="/spares/new" />} nativeButton={false}><Plus data-icon="inline-start" />New Request</Button> : <Button className="w-full sm:w-auto" onClick={()=>requirePermission(()=>{})}><LockKeyhole data-icon="inline-start" />New Request</Button>}
      </div>
      {savedView && <div className="flex items-center justify-between rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm"><span><strong>{savedView}</strong> is now available as a saved view.</span><button onClick={() => setSavedView('')} aria-label="Dismiss saved view"><X className="size-4" /></button></div>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{pipelineTiles.map(({label,value,detail,href,icon:Icon})=><Link key={label} href={href} className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_30px_rgba(15,23,42,.07)]"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span><div className="min-w-0"><div className="flex items-baseline gap-2"><span className="text-2xl font-semibold tabular tracking-[-0.04em]">{value}</span><span className="truncate text-sm font-semibold">{label}</span></div><p className="mt-0.5 text-xs text-muted-foreground">{detail}</p></div></Link>)}</div>
      <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden size-10 items-center justify-center rounded-xl bg-secondary sm:flex"><SlidersHorizontal className="size-4" /></div>
          <InputGroup className="h-10 min-w-0 basis-full rounded-xl sm:min-w-[260px] sm:flex-1"><InputGroupInput placeholder="Search request, spare, part number or equipment…" value={query} onChange={(e) => setQuery(e.target.value)} /><InputGroupAddon><Search className="size-4" /></InputGroupAddon></InputGroup>
          <Select value={unit} onValueChange={(value) => setUnit(value ?? 'all')}><SelectTrigger className="h-10 w-36 rounded-xl"><SelectValue>{unit === 'all' ? 'All units' : unit}</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All units</SelectItem><SelectItem value="Unit 1">Unit 1</SelectItem><SelectItem value="Unit 2">Unit 2</SelectItem><SelectItem value="GT-02">GT-02</SelectItem></SelectGroup></SelectContent></Select>
          <Select value={criticality} onValueChange={(v) => setCriticality(v as Criticality | 'all')}><SelectTrigger className="h-10 w-44 rounded-xl"><SelectValue>{criticality === 'all' ? 'All criticality' : criticality}</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All criticality</SelectItem>{['Critical','High','Medium','Low'].map(v => <SelectItem value={v} key={v}>{v}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <Select value={status} onValueChange={(v) => setStatus(v as OverallStatus | 'all')}><SelectTrigger className="h-10 w-48 rounded-xl"><SelectValue>{status === 'all' ? 'All statuses' : status}</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All statuses</SelectItem>{['On Track','Attention Required','Blocked','Ready for Review'].map(v => <SelectItem value={v} key={v}>{v}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <Button variant="outline" onClick={() => { setAdvancedDraft(advancedFilters); setAdvancedOpen(true) }}><Filter data-icon="inline-start" />More filters{activeAdvancedFilters.length ? ` (${activeAdvancedFilters.length})` : ''}</Button>
        </div>
        <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2 border-t border-border/70 pt-3">
          {focus && <span className="flex items-center gap-1.5 rounded-full border border-info/25 bg-info/[0.08] px-3 py-1 text-xs font-semibold text-info">Dashboard: {focus.replace('-', ' ')}<Link href="/spares" aria-label="Clear dashboard focus"><X className="size-3" /></Link></span>}
          {activeFilters.length ? activeFilters.map(filter => <span key={filter} className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary">{filter}<button onClick={() => { if (filter === criticality) setCriticality('all'); if (filter === status) setStatus('all'); if (filter === unit) setUnit('all') }} aria-label={`Remove ${filter}`}><X className="size-3" /></button></span>) : !focus && !activeAdvancedFilters.length && <span className="text-xs text-muted-foreground">No filters applied · {filtered.length} requests</span>}
          {activeAdvancedFilters.map((filter) => <span key={filter.key} className="flex items-center gap-1.5 rounded-full border border-info/25 bg-info/[0.08] px-3 py-1 text-xs font-semibold text-info">{filter.label}<button onClick={() => setAdvancedFilters((current) => ({ ...current, [filter.key]: 'all' }))} aria-label={`Remove ${filter.label}`}><X className="size-3" /></button></span>)}
          <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto"><Button className="flex-1 sm:flex-none" variant="ghost" size="sm" onClick={clearFilters}>Clear Filters</Button><Button className="flex-1 sm:flex-none" variant="outline" size="sm" onClick={() => setSaveOpen(true)}><Bookmark data-icon="inline-start" />Save View</Button></div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,.03),0_8px_24px_rgba(15,23,42,.04)]">
        <Table><TableHeader className="bg-muted/55"><TableRow><TableHead>Request ID</TableHead><TableHead>Spare / Part Number</TableHead><TableHead>Equipment</TableHead><TableHead>Unit</TableHead><TableHead>Criticality</TableHead><TableHead>Technical</TableHead><TableHead>Stock</TableHead><TableHead>Required</TableHead><TableHead>Lead Time</TableHead><TableHead>Risk</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.map(r => <TableRow key={r.id} className="group transition-colors hover:bg-primary/[0.035]"><TableCell><Link href={`/spares/${r.id}`} className="flex items-center gap-2 font-semibold text-primary"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/10"><Boxes className="size-3.5" /></span>{r.id}</Link></TableCell><TableCell><span className="block font-semibold">{r.spare}</span><span className="text-xs text-muted-foreground">{r.partNumberFrom}{r.partNumberFrom !== r.partNumberTo ? ` → ${r.partNumberTo}` : ''}</span></TableCell><TableCell>{r.equipment}</TableCell><TableCell>{r.unit}</TableCell><TableCell><StatusBadge status={r.criticality} /></TableCell><TableCell><StatusBadge status={r.technicalStatus} /></TableCell><TableCell className="tabular">{r.stockAvailable} available</TableCell><TableCell className="whitespace-nowrap">{new Date(r.requiredDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</TableCell><TableCell>{r.leadTimeWeeks} weeks</TableCell><TableCell><StatusBadge status={r.risk} /></TableCell><TableCell><StatusBadge status={r.overallStatus} /></TableCell><TableCell className="text-right"><Button variant="outline" size="sm" render={<Link href={`/spares/${r.id}`} />} nativeButton={false}>Open Workspace</Button></TableCell></TableRow>)}</TableBody>
        </Table>
      </div>
      {!filtered.length && <Empty><EmptyHeader><EmptyMedia variant="icon"><Search /></EmptyMedia><EmptyTitle>No requests match your filters</EmptyTitle><EmptyDescription>Try adjusting your search or filter criteria.</EmptyDescription></EmptyHeader></Empty>}
      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}><DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl p-6 sm:max-w-2xl"><DialogHeader><DialogTitle className="text-xl font-semibold">Advanced filters</DialogTitle><DialogDescription>Narrow the decision pipeline using technical, inventory, supplier, timing and risk signals.</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ADVANCED_FILTER_CONFIG.map((filter) => <div key={filter.key}><Label className="mb-2 block text-sm font-semibold">{filter.label}</Label><Select value={advancedDraft[filter.key]} onValueChange={(value) => setAdvancedDraft((current) => ({ ...current, [filter.key]: value ?? 'all' }))}><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>{advancedDraft[filter.key] === 'all' ? `All ${filter.label.toLowerCase()}` : filter.options.find((option) => option.value === advancedDraft[filter.key])?.label}</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>{filter.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select></div>)}</div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="ghost" onClick={() => setAdvancedDraft(EMPTY_ADVANCED_FILTERS)}>Reset</Button><Button variant="outline" onClick={() => setAdvancedOpen(false)}>Cancel</Button><Button onClick={() => { setAdvancedFilters(advancedDraft); setAdvancedOpen(false) }}>Apply Filters</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-md"><DialogHeader><DialogTitle className="text-xl font-semibold">Save this view</DialogTitle><DialogDescription>Name this filter combination so it can be reused during the demo.</DialogDescription></DialogHeader><div><Label className="mb-2 block text-sm font-semibold">View name</Label><Input value={viewName} onChange={e => setViewName(e.target.value)} className="h-10 rounded-xl" /></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button><Button disabled={!viewName.trim()} onClick={() => { setSavedView(viewName); setSaveOpen(false) }}>Save View</Button></DialogFooter></DialogContent></Dialog>
    </div>
  )
}

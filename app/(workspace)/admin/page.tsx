'use client'

import * as React from 'react'
import { Building2, Database, FileKey2, LockKeyhole, Plus, Settings2, ShieldCheck, Tags, Users, Wrench } from 'lucide-react'
import { ADMIN_SUMMARY, ADMIN_SUPPLIERS } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRole } from '@/lib/app-providers'
import { hasPermission } from '@/lib/permissions'
import { RoleAccessBanner } from '@/components/role-access-banner'

const MODULES = [
  ['Users', Users], ['Plants', Building2], ['Generating Units', Settings2], ['Equipment', Wrench],
  ['Spare Categories', Tags], ['Suppliers', ShieldCheck], ['Statuses', Settings2], ['Criticality Levels', Tags],
  ['CMMS Records', Database], ['ERP Records', Database], ['Contracts', FileKey2], ['Purchase Orders', FileKey2],
] as const

export default function AdminPage() {
  const { role } = useRole()
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'add'|'view'>('add')
  const [selectedModule, setSelectedModule] = React.useState('')
  const [suppliers, setSuppliers] = React.useState(ADMIN_SUPPLIERS)
  const [name, setName] = React.useState('Regional Seal Technologies')
  const saveSupplier = () => { if(mode==='add') setSuppliers(current => [...current, { name, type: 'Alternative', qualification: 'Pending', region: 'Regional', contract: '—', updated: '02 Oct 2026', status: 'Under Review' }]); setOpen(false) }

  if (!hasPermission(role, 'manage-master-data')) return <div className="mx-auto flex min-h-[65vh] max-w-xl items-center"><Card className="w-full text-center"><CardContent className="flex flex-col items-center px-8 py-12"><span className="flex size-14 items-center justify-center rounded-2xl bg-info/10 text-info"><LockKeyhole className="size-6" /></span><h1 className="mt-5 text-2xl font-semibold tracking-tight">Admin access required</h1><p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Master data, users, suppliers and system configuration are restricted to the Admin role. Use the role menu in the top-right corner to switch roles for this prototype.</p></CardContent></Card></div>

  return <div className="flex flex-col gap-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"><span className="h-px w-6 bg-primary/60" />Administration</div><h1 className="text-3xl font-semibold tracking-[-0.035em]">System administration</h1><p className="mt-2 text-[15px] text-muted-foreground">Manage trusted master data used across plant decisions.</p></div><Button onClick={() => {setMode('add');setName('Regional Seal Technologies');setOpen(true)}}><Plus data-icon="inline-start" />Add Supplier</Button></div>
    <RoleAccessBanner permission="manage-master-data" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{ADMIN_SUMMARY.map(item => <Card key={item.label} size="sm"><CardHeader className="pb-0"><CardDescription>{item.label}</CardDescription></CardHeader><CardContent className="flex items-end justify-between"><span className="text-3xl font-semibold tabular tracking-[-0.04em]">{item.value}</span><span className="text-xs text-muted-foreground">Current records</span></CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle>Management areas</CardTitle><CardDescription>Configuration and trusted data sources used by the prototype.</CardDescription></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{MODULES.map(([label,Icon]) => <button key={label} onClick={()=>setSelectedModule(label)} className="group flex items-center gap-3 rounded-xl border border-border p-3.5 text-left transition-all hover:border-primary/25 hover:bg-primary/[0.035]"><span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"><Icon className="size-4.5" /></span><span className="font-semibold">{label}</span></button>)}</div>{selectedModule&&<div className="mt-4 flex items-center justify-between rounded-xl border border-info/25 bg-info/10 px-4 py-3 text-sm"><span><strong>{selectedModule}</strong> management selected. This prototype shows the shared master-data workspace.</span><Button variant="ghost" size="sm" onClick={()=>setSelectedModule('')}>Close</Button></div>}</CardContent></Card>
    <Card><CardHeader className="grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto]"><div><CardTitle>Suppliers</CardTitle><CardDescription className="mt-1">Qualification, contracts and current record status.</CardDescription></div><StatusBadge status={`${suppliers.length} records`} tone="neutral" /></CardHeader><CardContent className="overflow-x-auto px-0"><Table><TableHeader><TableRow><TableHead>Supplier</TableHead><TableHead>Type</TableHead><TableHead>Qualification</TableHead><TableHead>Region</TableHead><TableHead>Contract</TableHead><TableHead>Last Updated</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{suppliers.map(s => <TableRow key={s.name}><TableCell className="font-semibold">{s.name}</TableCell><TableCell>{s.type}</TableCell><TableCell><StatusBadge status={s.qualification} /></TableCell><TableCell>{s.region}</TableCell><TableCell>{s.contract}</TableCell><TableCell>{s.updated}</TableCell><TableCell><StatusBadge status={s.status} /></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => {setMode('view');setName(s.name);setOpen(true)}}>View</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="rounded-2xl p-6 sm:max-w-xl"><DialogHeader><DialogTitle className="text-xl font-semibold">{mode==='add'?'Add supplier':'Supplier record'}</DialogTitle><DialogDescription>{mode==='add'?'Create a mocked supplier record for qualification review.':'Review the current qualification and commercial record.'}</DialogDescription></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><Field label="Supplier name"><Input value={name} onChange={e=>setName(e.target.value)} className="h-10 rounded-xl" /></Field><Field label="Type"><Select defaultValue="alternative"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Alternative</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="alternative">Alternative</SelectItem><SelectItem value="oem">OEM</SelectItem></SelectGroup></SelectContent></Select></Field><Field label="Location"><Input defaultValue="Regional" className="h-10 rounded-xl" /></Field><Field label="Qualification status"><Select defaultValue="pending"><SelectTrigger className="h-10 w-full rounded-xl"><SelectValue>Pending</SelectValue></SelectTrigger><SelectContent><SelectGroup><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem></SelectGroup></SelectContent></Select></Field><Field label="Primary contact" className="sm:col-span-2"><Input defaultValue="Amina Shah · Technical Sales" className="h-10 rounded-xl" /></Field><Field label="Notes" className="sm:col-span-2"><Textarea defaultValue="Qualification documents received; engineering review required." className="min-h-20 rounded-xl" /></Field></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={saveSupplier} disabled={!name.trim()}>{mode==='add'?'Add Supplier':'Save Changes'}</Button></DialogFooter></DialogContent></Dialog>
  </div>
}

function Field({label,children,className}:{label:string;children:React.ReactNode;className?:string}){return <div className={className}><Label className="mb-2 block text-sm font-semibold">{label}</Label>{children}</div>}

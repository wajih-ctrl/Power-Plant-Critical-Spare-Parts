'use client'

import * as React from 'react'
import { Eye, FileText } from 'lucide-react'
import { TECHNICAL_DOCUMENTS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function TechnicalDocumentList(){
  const [selected,setSelected]=React.useState<(typeof TECHNICAL_DOCUMENTS)[number]|null>(null)
  return <><div className="flex flex-col gap-2">{TECHNICAL_DOCUMENTS.map(doc=><div key={doc.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-muted/45"><div className="flex min-w-0 items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><FileText className="size-4" /></span><div><p className="font-semibold">{doc.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{doc.type} · {doc.date}</p></div></div><div className="flex items-center gap-2"><StatusBadge status={doc.status} /><Button variant="outline" size="sm" onClick={()=>setSelected(doc)}><Eye data-icon="inline-start" />View</Button></div></div>)}</div>
  <Dialog open={!!selected} onOpenChange={open=>!open&&setSelected(null)}><DialogContent className="rounded-2xl p-6 sm:max-w-2xl"><DialogHeader><DialogTitle className="text-xl font-semibold">{selected?.title}</DialogTitle><DialogDescription>{selected?.type} · Controlled reference preview</DialogDescription></DialogHeader><div className="rounded-xl border border-border bg-muted/35 p-6"><div className="mb-5 flex items-center justify-between border-b border-border pb-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technical record</p><p className="mt-1 text-lg font-semibold">MS-421B replacement reference</p></div><StatusBadge status={selected?.status??'Current'} /></div><p className="text-sm leading-7 text-muted-foreground">This mocked document confirms that MS-421B supersedes MS-420. Final compatibility remains subject to confirmation against Cooling Water Pump P-201, model CWP-900, Rev. C configuration.</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-card p-3"><span className="text-muted-foreground">Equipment</span><p className="font-semibold">EQ-P201</p></div><div className="rounded-lg bg-card p-3"><span className="text-muted-foreground">Reference</span><p className="font-semibold">SB-2024-018</p></div></div></div><DialogFooter className="-mx-6 -mb-6 mt-2 px-6 py-4"><Button onClick={()=>setSelected(null)}>Close Preview</Button></DialogFooter></DialogContent></Dialog></>
}

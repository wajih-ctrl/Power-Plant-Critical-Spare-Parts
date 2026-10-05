'use client'

import { useState } from 'react'
import { Bell, Check, ChevronDown, CircleHelp, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GlobalSearch } from './global-search'
import { SidebarNav } from './sidebar'
import { useRole } from '@/lib/app-providers'
import { ROLE_OPTIONS } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const NOTIFICATIONS = [
  {
    title: 'Supplier B qualification updated',
    detail: 'Commercial registration confirmed valid.',
    time: '12m ago',
    href: '/spares/CSR-2026-014/suppliers',
  },
  {
    title: 'Lead-time conflict detected',
    detail: 'OEM delivery exceeds required date for CSR-2026-014.',
    time: '1h ago',
    href: '/spares/CSR-2026-014/conflicts',
  },
  {
    title: 'New critical spare request',
    detail: 'CSR-2026-017 submitted for Unit 1.',
    time: '3h ago',
    href: '/spares',
  },
]

export function AppTopbar() {
  const router = useRouter()
  const { role, setRole } = useRole()
  const roleLabel = ROLE_OPTIONS.find((r) => r.id === role)?.label ?? 'Procurement'
  const [navOpen, setNavOpen] = useState(false)
  const [plant, setPlant] = useState('Sample Power Plant')
  const [unit, setUnit] = useState('All Units')
  const [unread, setUnread] = useState(true)

  const selectScope = (kind: 'plant' | 'unit', value: string) => {
    if (kind === 'plant') setPlant(value)
    else setUnit(value)
    toast.success(`${kind === 'plant' ? 'Plant' : 'Unit'} scope updated`, { description: `The workspace is now scoped to ${value}.` })
  }

  return (
    <header className="z-20 flex h-20 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl md:gap-4 md:px-8">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4.5" />
        </button>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger className="hidden items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">SP</span>
          <span className="hidden xl:inline">{plant}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {['Sample Power Plant','Riverside Generating Station','Northfield CCGT Plant'].map(value => <DropdownMenuItem key={value} onClick={()=>selectScope('plant',value)}>{value}<Check className={`ml-auto size-4 ${plant===value?'opacity-100':'opacity-0'}`} /></DropdownMenuItem>)}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted lg:flex">
          {unit}
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {['All Units','Unit 1','Unit 2','GT-02'].map(value => <DropdownMenuItem key={value} onClick={()=>selectScope('unit',value)}>{value}<Check className={`ml-auto size-4 ${unit===value?'opacity-100':'opacity-0'}`} /></DropdownMenuItem>)}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="min-w-0 flex-1 px-1 md:px-3">
        <GlobalSearch />
      </div>

      <Popover>
        <PopoverTrigger onClick={()=>setUnread(false)} aria-label="Notifications" className="relative flex size-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground hover:shadow-sm">
          <Bell className="size-4.5" />
          {unread && <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
          </div>
          <div className="flex flex-col">
            {NOTIFICATIONS.map((n) => (
              <button type="button" onClick={()=>router.push(n.href)} key={n.title} className="flex flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/60">
                <p className="text-sm font-medium leading-snug">{n.title}</p>
                <p className="text-xs leading-snug text-muted-foreground">{n.detail}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover><PopoverTrigger className="hidden size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex" aria-label="Help"><CircleHelp className="size-4.5" /></PopoverTrigger><PopoverContent align="end" className="w-72"><p className="text-sm font-semibold">Decision workspace guide</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Follow the numbered decision steps from requirement through management review. Amber steps still need human input.</p></PopoverContent></Popover>

      <div className="hidden h-6 w-px bg-border sm:block" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-muted">
          <Badge variant="outline" className="hidden rounded-md border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-flex">
            {roleLabel}
          </Badge>
          <Avatar className="size-9 ring-2 ring-card shadow-sm">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
              {roleLabel.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Viewing as</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLE_OPTIONS.map((r) => (
              <DropdownMenuItem key={r.id} onClick={() => { setRole(r.id); toast.success(`Role changed to ${r.label}`) }}>
                {r.label}<Check className={`ml-auto size-4 ${role===r.id?'opacity-100':'opacity-0'}`} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

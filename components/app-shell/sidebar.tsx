'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Factory, HelpCircle, LockKeyhole, LogOut, Settings, Zap } from 'lucide-react'
import { ADMIN_NAV, PRIMARY_NAV } from '@/lib/navigation'
import { ROLE_OPTIONS } from '@/lib/mock-data'
import { useRole } from '@/lib/app-providers'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { hasPermission } from '@/lib/permissions'
import { ROLE_WORKSPACES } from '@/lib/role-workspace'

function isItemActive(label: string, match: string, pathname: string) {
  if (label === 'Critical Spares') {
    return pathname === '/spares' || pathname === '/spares/new' || /^\/spares\/[^/]+$/.test(pathname)
  }
  return pathname.includes(match)
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { role } = useRole()
  const roleLabel = ROLE_OPTIONS.find((r) => r.id === role)?.label ?? 'Procurement'
  const canManageAdmin = hasPermission(role, 'manage-master-data')
  const roleWorkspace = ROLE_WORKSPACES[role]
  const visibleNav = PRIMARY_NAV.filter(item => item.label === 'Dashboard' || item.label === 'Critical Spares' || roleWorkspace.navFocus.includes(item.label))

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,.3)] ring-1 ring-white/10">
          <Factory className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-[-0.02em]">PlantSpare Decision</span>
          <span className="mt-0.5 text-xs font-medium text-sidebar-foreground/50">Decision workspace</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-3 px-3"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/35">{roleLabel} workspace</p><p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/40">Navigation prioritized for your responsibilities</p></div>
        <ul className="flex flex-col gap-0.5">
          {visibleNav.map((item) => {
            const active = isItemActive(item.label, item.match, pathname)
            const Icon = item.icon
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-white/5'
                      : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  )}
                >
                  <Icon className={cn('size-[18px] shrink-0 transition-colors', active ? 'text-sidebar-primary' : 'text-sidebar-foreground/45 group-hover:text-sidebar-foreground/80')} />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="my-4 h-px bg-sidebar-border" />

        <ul className="flex flex-col gap-0.5">
          <li>
            {canManageAdmin ? <Link
              href={ADMIN_NAV.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <ADMIN_NAV.icon className="size-4 shrink-0" />
              <span className="truncate">{ADMIN_NAV.label}</span>
            </Link> : <button
              type="button"
              onClick={() => toast.error('Admin permission required', { description: `${roleLabel} has view-only workspace access. Switch to the Admin role to manage master data.` })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <ADMIN_NAV.icon className="size-4 shrink-0" />
              <span className="truncate">{ADMIN_NAV.label}</span>
              <LockKeyhole className="ml-auto size-3.5" />
            </button>}
          </li>
        </ul>
      </nav>

      <div className="mx-3 mb-3 rounded-2xl border border-white/8 bg-white/[0.035] p-2.5">
        <div className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
          <Avatar className="size-9 ring-1 ring-white/10">
            <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {roleLabel.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold">{roleLabel}</span>
            <span className="truncate text-xs text-sidebar-foreground/45">Sample Power Plant</span>
          </div>
          <Zap className="ml-auto size-3.5 text-sidebar-primary" />
        </div>
        <div className="flex items-center gap-1 px-1">
          <Tooltip>
            <TooltipTrigger
              onClick={() => canManageAdmin ? router.push('/admin') : toast.error('Admin permission required', { description: 'Switch to the Admin role to open system settings.' })}
              className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={() => toast.info('Help center: use the decision steps to review each input in sequence.')}
              className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              aria-label="Help"
            >
              <HelpCircle className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Help</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={() => router.push('/')}
              className="ml-auto flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Log out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-[272px] shrink-0 flex-col border-r border-sidebar-border shadow-[14px_0_35px_rgba(15,23,42,.08)] lg:flex">
      <SidebarNav />
    </aside>
  )
}

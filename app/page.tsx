'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Check, Factory, ShieldCheck, Sparkles } from 'lucide-react'
import { useRole } from '@/lib/app-providers'
import { ROLE_OPTIONS } from '@/lib/mock-data'
import type { Role } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { role, setRole } = useRole()
  const [selected, setSelected] = React.useState<Role>(role)

  function enterWorkspace(withRole: Role) {
    setRole(withRole)
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-[46%] shrink-0 overflow-hidden lg:block">
        <Image
          src="/images/plant-control-room.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(5,15,35,.92),rgba(9,35,74,.48)_58%,rgba(5,15,35,.82))]" />
        <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_10px_35px_rgba(59,130,246,.35)] ring-1 ring-white/20">
              <Factory className="size-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight">PlantSpare</span>
              <span className="text-xs text-white/50">Decision workspace</span>
            </div>
          </div>
          <div className="max-w-lg text-white">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
              <ShieldCheck className="size-3.5 text-blue-300" />
              Built for traceable plant decisions
            </div>
            <p className="text-pretty text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-5xl">
              Make critical spare decisions with complete context.
            </p>
            <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-white/65">
              Technical validation, inventory, suppliers and operational risk — compiled into a
              single, traceable record before any purchase decision is made.
            </p>
            <div className="mt-8 flex gap-6 text-sm text-white/65">
              <span className="flex items-center gap-2"><Check className="size-4 text-blue-300" />Unified records</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-blue-300" />Clear approvals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-grid relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-background/86" />
        <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,.11)] backdrop-blur sm:p-9">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Factory className="size-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">PlantSpare Decision</span>
          </div>

          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="size-4.5" /></div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Continue as</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            The workspace adapts the information shown to the responsibilities of your role.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const active = selected === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-all',
                    active
                      ? 'border-primary/60 bg-primary/[0.065] shadow-sm ring-2 ring-primary/10'
                      : 'border-border hover:border-primary/25 hover:bg-muted/60',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                      active ? 'border-primary bg-primary shadow-sm shadow-primary/25' : 'border-border bg-background',
                    )}
                  >
                    {active && <Check className="size-3 text-primary-foreground" />}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{option.label}</span>
                    <span className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={() => enterWorkspace(selected)}>
            Enter Decision Workspace
          </Button>

          <button
            type="button"
            onClick={() => enterWorkspace('management')}
            className="mt-3 w-full text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View demo scenario as Management
          </button>
        </div>
      </div>
    </div>
  )
}

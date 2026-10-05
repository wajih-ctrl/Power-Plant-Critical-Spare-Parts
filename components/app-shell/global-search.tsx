'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { GLOBAL_SEARCH_INDEX } from '@/lib/mock-data'

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const groups = Array.from(new Set(GLOBAL_SEARCH_INDEX.map((i) => i.group)))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto flex h-10 w-full max-w-md items-center gap-2.5 rounded-xl border border-border bg-card/90 px-3.5 text-sm text-muted-foreground shadow-sm transition-all hover:border-ring/50 hover:text-foreground hover:shadow-md"
      >
        <Search className="size-4" />
        <span className="truncate">Search requests, parts, equipment…</span>
        <kbd className="ml-auto hidden rounded-md border border-border bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline">
          Ctrl K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search the decision workspace">
        <CommandInput placeholder="Search by request, part number, equipment or supplier…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {GLOBAL_SEARCH_INDEX.filter((i) => i.group === group).map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    setOpen(false)
                    router.push(item.href)
                  }}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type Tone = 'success' | 'warning' | 'destructive' | 'info' | 'neutral' | 'primary'

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/15 text-warning-foreground border-warning/35',
  destructive: 'bg-destructive/10 text-destructive border-destructive/25',
  info: 'bg-info/10 text-info border-info/25',
  neutral: 'bg-muted text-muted-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/25',
}

const STATUS_TONE_MAP: Record<string, Tone> = {
  // criticality / risk
  Critical: 'destructive',
  High: 'destructive',
  Medium: 'warning',
  Low: 'success',
  Potential: 'info',
  'Low–Medium': 'warning',

  // technical
  Validated: 'success',
  'Validation Pending': 'warning',
  'Needs Review': 'warning',
  'Needs More Information': 'warning',
  'Pending Validation': 'warning',
  'Pending Confirmation': 'warning',
  'Not Yet Confirmed': 'warning',
  'Obsolete Reference': 'destructive',
  Obsolete: 'destructive',
  'Technical Validation Pending': 'warning',

  // inventory / commercial
  'No Available Stock': 'destructive',
  'Lead-Time Risk': 'destructive',
  'Delivery Conflict': 'destructive',
  'Operational Risk: High': 'destructive',
  Reserved: 'warning',
  'In Transit': 'info',
  Available: 'success',

  // overall / workflow
  'Attention Required': 'destructive',
  'On Track': 'success',
  Blocked: 'destructive',
  'Ready for Review': 'primary',
  'Management Review Ready': 'primary',

  // supplier / qualification
  Approved: 'success',
  Pending: 'warning',
  Required: 'destructive',
  'Technical Qualification Required': 'warning',
  'Qualification Required': 'warning',
  'Technical Review Requested': 'info',
  'In Review': 'info',
  Serviceable: 'success',
  Active: 'success',
  'Under Review': 'warning',
  'Approved / Delivery Risk': 'warning',

  // conflicts
  Conflict: 'destructive',
  Outdated: 'warning',
  'Verification Requested': 'info',

  // currently-neutral statuses
  Draft: 'neutral',
}

export function toneForStatus(status: string): Tone {
  return STATUS_TONE_MAP[status] ?? 'neutral'
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string
  tone?: Tone
  className?: string
}) {
  const resolvedTone = tone ?? toneForStatus(status)
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold leading-none tracking-[-0.01em]', TONE_CLASSES[resolvedTone], className)}
    >
      {status}
    </Badge>
  )
}

'use client'

import { Eye, ShieldCheck } from 'lucide-react'
import { useRole } from '@/lib/app-providers'
import { ROLE_OPTIONS } from '@/lib/mock-data'
import { hasPermission, PERMISSION_LABELS, type Permission } from '@/lib/permissions'

export function RoleAccessBanner({ permission }: { permission: Permission }) {
  const { role } = useRole()
  const allowed = hasPermission(role, permission)
  const roleLabel = ROLE_OPTIONS.find((item) => item.id === role)?.label ?? role

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${allowed ? 'border-success/25 bg-success/[0.07]' : 'border-info/25 bg-info/[0.07]'}`}>
      {allowed ? <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-success" /> : <Eye className="mt-0.5 size-4.5 shrink-0 text-info" />}
      <div>
        <p className="font-semibold">{allowed ? `${roleLabel} action access` : `${roleLabel} view-only access`}</p>
        <p className="mt-0.5 text-muted-foreground">
          {allowed
            ? `This role can ${PERMISSION_LABELS[permission]} in the prototype.`
            : `You can inspect this information, but this role cannot ${PERMISSION_LABELS[permission]}.`}
        </p>
      </div>
    </div>
  )
}

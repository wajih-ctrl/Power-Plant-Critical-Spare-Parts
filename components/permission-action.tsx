'use client'

import * as React from 'react'
import { LockKeyhole } from 'lucide-react'
import { toast } from 'sonner'
import { useRole } from '@/lib/app-providers'
import { hasPermission, PERMISSION_LABELS, type Permission } from '@/lib/permissions'
import { ROLE_OPTIONS } from '@/lib/mock-data'

export function usePermissionAction(permission: Permission) {
  const { role } = useRole()
  const allowed = hasPermission(role, permission)
  const roleLabel = ROLE_OPTIONS.find((item) => item.id === role)?.label ?? role

  const requirePermission = React.useCallback(
    (action: () => void) => {
      if (allowed) {
        action()
        return true
      }
      toast.error('Permission required', {
        description: `${roleLabel} has view-only access here. Switch to an authorized role to ${PERMISSION_LABELS[permission]}.`,
        icon: <LockKeyhole className="size-4" />,
      })
      return false
    },
    [allowed, permission, roleLabel],
  )

  return { allowed, requirePermission, roleLabel }
}

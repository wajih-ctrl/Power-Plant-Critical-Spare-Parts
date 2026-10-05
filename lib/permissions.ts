import type { Role } from './types'

export type Permission =
  | 'create-request'
  | 'validate-technical'
  | 'request-verification'
  | 'review-supplier'
  | 'prepare-management-review'
  | 'manage-master-data'

const PERMISSIONS: Record<Permission, Role[]> = {
  'create-request': ['procurement', 'maintenance', 'admin'],
  'validate-technical': ['engineering', 'admin'],
  'request-verification': ['engineering', 'maintenance', 'inventory', 'admin'],
  'review-supplier': ['procurement', 'engineering', 'admin'],
  'prepare-management-review': ['procurement', 'management', 'admin'],
  'manage-master-data': ['admin'],
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  'create-request': 'create critical spare requests',
  'validate-technical': 'confirm technical compatibility',
  'request-verification': 'request physical verification',
  'review-supplier': 'send suppliers for qualification review',
  'prepare-management-review': 'prepare decisions for management review',
  'manage-master-data': 'manage master data',
}

export function hasPermission(role: Role, permission: Permission) {
  return PERMISSIONS[permission].includes(role)
}

export function permissionRoles(permission: Permission) {
  return PERMISSIONS[permission]
}

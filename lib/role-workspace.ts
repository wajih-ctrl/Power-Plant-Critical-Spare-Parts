import type { Role } from './types'

export interface RoleQuickAction {
  label: string
  detail: string
  href: string
}

export interface RoleWorkspace {
  title: string
  description: string
  insightBadges: string[]
  metricOrder: number[]
  navFocus: string[]
  quickActions: RoleQuickAction[]
}

export const ROLE_WORKSPACES: Record<Role, RoleWorkspace> = {
  procurement: {
    title: 'Procurement command center',
    description: 'Prioritize supplier qualification, contract coverage, pricing and delivery exposure.',
    insightBadges: ['2 lead-time risks', '1 supplier qualification', '3 active contracts'],
    metricOrder: [0, 4, 2, 5, 1, 3],
    navFocus: ['Suppliers & Procurement', 'Data Conflicts', 'Decision Summary'],
    quickActions: [
      { label: 'Compare suppliers', detail: 'Price, lead time and contract coverage', href: '/spares/CSR-2026-014/suppliers' },
      { label: 'Review commercial conflicts', detail: 'Outdated pricing and supplier gaps', href: '/spares/CSR-2026-014/conflicts' },
      { label: 'Prepare decision record', detail: 'Compile inputs for management review', href: '/spares/CSR-2026-014/summary' },
    ],
  },
  maintenance: {
    title: 'Maintenance planning center',
    description: 'Align spare availability with work orders, maintenance dates and outage windows.',
    insightBadges: ['3 upcoming events', '1 reserved spare', '2 schedule risks'],
    metricOrder: [0, 3, 4, 5, 1, 2],
    navFocus: ['Inventory & Maintenance', 'Operational Risk', 'Decision Summary'],
    quickActions: [
      { label: 'Review maintenance window', detail: 'Required date, outage and work order', href: '/spares/CSR-2026-014/inventory-maintenance' },
      { label: 'Check operational impact', detail: 'Equipment and outage exposure', href: '/spares/CSR-2026-014/risk' },
      { label: 'Open decision summary', detail: 'See all outstanding inputs', href: '/spares/CSR-2026-014/summary' },
    ],
  },
  engineering: {
    title: 'Engineering validation center',
    description: 'Resolve obsolete references, installed-equipment compatibility and technical qualification.',
    insightBadges: ['4 need validation', '3 obsolete references', '2 technical conflicts'],
    metricOrder: [1, 2, 0, 5, 3, 4],
    navFocus: ['Technical Validation', 'Data Conflicts', 'Decision Summary'],
    quickActions: [
      { label: 'Validate replacement', detail: 'Confirm MS-421B against Rev. C', href: '/spares/CSR-2026-014/technical-validation' },
      { label: 'Resolve technical conflicts', detail: 'Compare CMMS and OEM references', href: '/spares/CSR-2026-014/conflicts' },
      { label: 'Review supplier documents', detail: 'Assess Supplier B qualification', href: '/spares/CSR-2026-014/suppliers' },
    ],
  },
  inventory: {
    title: 'Inventory control center',
    description: 'Focus on usable stock, reservations, physical verification and inbound supply.',
    insightBadges: ['5 stock shortages', '1 reserved unit', '2 inbound items'],
    metricOrder: [3, 0, 4, 5, 1, 2],
    navFocus: ['Inventory & Maintenance', 'Data Conflicts', 'Decision Summary'],
    quickActions: [
      { label: 'Review stock position', detail: 'Available, reserved and in-transit quantities', href: '/spares/CSR-2026-014/inventory-maintenance' },
      { label: 'Inspect allocation conflict', detail: 'Reserved stock and work-order ownership', href: '/spares/CSR-2026-014/conflicts' },
      { label: 'View critical shortages', detail: 'Filter requests with no usable stock', href: '/spares?focus=stock' },
    ],
  },
  operations: {
    title: 'Operations risk center',
    description: 'Monitor equipment availability, production exposure and planned outage impact.',
    insightBadges: ['3 high-risk items', '1 outage conflict', '2 production exposures'],
    metricOrder: [5, 4, 3, 0, 1, 2],
    navFocus: ['Operational Risk', 'Inventory & Maintenance', 'Decision Summary'],
    quickActions: [
      { label: 'Review operational risk', detail: 'Equipment and production consequences', href: '/spares/CSR-2026-014/risk' },
      { label: 'Check maintenance timing', detail: 'Required date versus outage schedule', href: '/spares/CSR-2026-014/inventory-maintenance' },
      { label: 'Open decision summary', detail: 'See current blockers and alternatives', href: '/spares/CSR-2026-014/summary' },
    ],
  },
  management: {
    title: 'Management decision center',
    description: 'Review decision readiness, unresolved blockers, operational risk and commercial options.',
    insightBadges: ['3 high-risk items', '2 ready soon', '4 unresolved inputs'],
    metricOrder: [5, 0, 4, 1, 2, 3],
    navFocus: ['Decision Summary', 'Operational Risk', 'Data Conflicts'],
    quickActions: [
      { label: 'Review decision summary', detail: 'Consolidated technical and commercial facts', href: '/spares/CSR-2026-014/summary' },
      { label: 'Assess operational risk', detail: 'Impact if the spare is unavailable', href: '/spares/CSR-2026-014/risk' },
      { label: 'Inspect unresolved conflicts', detail: 'Inputs still requiring human review', href: '/spares/CSR-2026-014/conflicts' },
    ],
  },
  admin: {
    title: 'Administration overview',
    description: 'Monitor trusted master data, users, suppliers and integration records.',
    insightBadges: ['28 active users', '12 records to review', '64 approved suppliers'],
    metricOrder: [0, 2, 1, 5, 3, 4],
    navFocus: [],
    quickActions: [
      { label: 'Open system administration', detail: 'Users, plants, equipment and suppliers', href: '/admin' },
      { label: 'Review data conflicts', detail: 'Records needing master-data attention', href: '/spares/CSR-2026-014/conflicts' },
      { label: 'Audit decision record', detail: 'Verify compiled workflow information', href: '/spares/CSR-2026-014/summary' },
    ],
  },
}

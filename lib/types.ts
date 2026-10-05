export type Role =
  | 'procurement'
  | 'maintenance'
  | 'engineering'
  | 'inventory'
  | 'operations'
  | 'management'
  | 'admin'

export type Criticality = 'Low' | 'Medium' | 'High' | 'Critical'

export type RiskLevel = 'Low' | 'Medium' | 'High'

export type OverallStatus = 'On Track' | 'Attention Required' | 'Blocked' | 'Ready for Review'

export interface SpareRequestSummary {
  id: string
  spare: string
  partNumberFrom: string
  partNumberTo: string
  equipment: string
  equipmentId: string
  unit: string
  plant: string
  criticality: Criticality
  technicalStatus: 'Validated' | 'Validation Pending' | 'Needs Review'
  stockAvailable: number
  stockReserved: number
  stockInTransit: number
  requiredDate: string
  leadTimeWeeks: number
  risk: RiskLevel
  overallStatus: OverallStatus
  reason: string
  requestedBy: string
  requestedByRole: string
  workOrder: string
}

export interface Supplier {
  id: string
  name: string
  type: 'OEM' | 'Alternative'
  qualification: 'Approved' | 'Pending' | 'Required'
  price: number
  leadTimeWeeks: number
  canMeetRequiredDate: 'Yes' | 'No' | 'Potentially Yes'
  contract: boolean
  contractRef?: string
  openPo: string | null
  source: 'International' | 'Regional'
  status: string
}

export interface TechnicalDocument {
  id: string
  title: string
  type: string
  date: string
  status: 'Current' | 'Reference' | 'Archived'
}

export interface DataConflict {
  id: string
  title: string
  severity: 'High' | 'Medium' | 'Low'
  category: 'Technical' | 'Commercial' | 'Inventory' | 'Supplier'
  description: string
  sourceA?: { label: string; value: string }
  sourceB?: { label: string; value: string }
  status: 'Needs Review' | 'Outdated' | 'Conflict' | 'Pending Confirmation'
  actionLabel: string
  actionTarget: string
}

export interface RiskFactor {
  id: string
  title: string
  level: 'High' | 'Medium' | 'Low' | 'Potential'
  description: string
}

export interface RoleOption {
  id: Role
  label: string
  description: string
}

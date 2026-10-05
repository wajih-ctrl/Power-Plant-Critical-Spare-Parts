import {
  LayoutDashboard,
  PackageSearch,
  ShieldCheck,
  Boxes,
  Truck,
  AlertTriangle,
  Gauge,
  FileCheck2,
  Settings2,
  type LucideIcon,
} from 'lucide-react'
import { MAIN_REQUEST_ID } from './mock-data'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  match: string
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, match: '/dashboard' },
  { label: 'Critical Spares', href: '/spares', icon: PackageSearch, match: '/spares' },
  {
    label: 'Technical Validation',
    href: `/spares/${MAIN_REQUEST_ID}/technical-validation`,
    icon: ShieldCheck,
    match: '/technical-validation',
  },
  {
    label: 'Inventory & Maintenance',
    href: `/spares/${MAIN_REQUEST_ID}/inventory-maintenance`,
    icon: Boxes,
    match: '/inventory-maintenance',
  },
  {
    label: 'Suppliers & Procurement',
    href: `/spares/${MAIN_REQUEST_ID}/suppliers`,
    icon: Truck,
    match: '/suppliers',
  },
  {
    label: 'Data Conflicts',
    href: `/spares/${MAIN_REQUEST_ID}/conflicts`,
    icon: AlertTriangle,
    match: '/conflicts',
  },
  {
    label: 'Operational Risk',
    href: `/spares/${MAIN_REQUEST_ID}/risk`,
    icon: Gauge,
    match: '/risk',
  },
  {
    label: 'Decision Summary',
    href: `/spares/${MAIN_REQUEST_ID}/summary`,
    icon: FileCheck2,
    match: '/summary',
  },
]

export const ADMIN_NAV: NavItem = {
  label: 'Admin',
  href: '/admin',
  icon: Settings2,
  match: '/admin',
}

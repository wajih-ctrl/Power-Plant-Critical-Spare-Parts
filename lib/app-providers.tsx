'use client'

import * as React from 'react'
import { MAIN_REQUEST_ID } from './mock-data'
import type { Role } from './types'

// ---------------------------------------------------------------------------
// Role context — selected on the role-selection screen, persisted in memory
// for the duration of the session so the demo can be clicked through without
// a real auth backend.
// ---------------------------------------------------------------------------

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = React.createContext<RoleContextValue | null>(null)

export function useRole() {
  const ctx = React.useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within AppProviders')
  return ctx
}

// ---------------------------------------------------------------------------
// Decision state — per-request mutable prototype state so actions taken on
// one screen (e.g. "Mark Compatibility Confirmed") are visibly reflected on
// every other screen (progress tracker, badges, decision summary).
// ---------------------------------------------------------------------------

export interface DecisionState {
  compatibility: 'Pending Validation' | 'Validated'
  physicalVerificationStatus: 'Not Requested' | 'Verification Requested'
  supplierBQualification: 'Pending' | 'Technical Review Requested' | 'Approved'
  managementReviewReady: boolean
}

const DEFAULT_STATE: DecisionState = {
  compatibility: 'Pending Validation',
  physicalVerificationStatus: 'Not Requested',
  supplierBQualification: 'Pending',
  managementReviewReady: false,
}

type Action =
  | { type: 'confirm-compatibility'; requestId: string }
  | { type: 'request-physical-verification'; requestId: string }
  | { type: 'send-supplier-b-to-review'; requestId: string }
  | { type: 'approve-supplier-b'; requestId: string }
  | { type: 'mark-management-review-ready'; requestId: string }

function reducer(
  state: Record<string, DecisionState>,
  action: Action,
): Record<string, DecisionState> {
  const current = state[action.requestId] ?? DEFAULT_STATE
  switch (action.type) {
    case 'confirm-compatibility':
      return { ...state, [action.requestId]: { ...current, compatibility: 'Validated' } }
    case 'request-physical-verification':
      return {
        ...state,
        [action.requestId]: { ...current, physicalVerificationStatus: 'Verification Requested' },
      }
    case 'send-supplier-b-to-review':
      return {
        ...state,
        [action.requestId]: { ...current, supplierBQualification: 'Technical Review Requested' },
      }
    case 'approve-supplier-b':
      return {
        ...state,
        [action.requestId]: { ...current, supplierBQualification: 'Approved' },
      }
    case 'mark-management-review-ready':
      return { ...state, [action.requestId]: { ...current, managementReviewReady: true } }
    default:
      return state
  }
}

interface DecisionContextValue {
  getState: (requestId: string) => DecisionState
  confirmCompatibility: (requestId: string) => void
  requestPhysicalVerification: (requestId: string) => void
  sendSupplierBToReview: (requestId: string) => void
  approveSupplierB: (requestId: string) => void
  markManagementReviewReady: (requestId: string) => void
}

const DecisionContext = React.createContext<DecisionContextValue | null>(null)

export function useDecisionState(requestId: string = MAIN_REQUEST_ID) {
  const ctx = React.useContext(DecisionContext)
  if (!ctx) throw new Error('useDecisionState must be used within AppProviders')
  return {
    state: ctx.getState(requestId),
    confirmCompatibility: () => ctx.confirmCompatibility(requestId),
    requestPhysicalVerification: () => ctx.requestPhysicalVerification(requestId),
    sendSupplierBToReview: () => ctx.sendSupplierBToReview(requestId),
    approveSupplierB: () => ctx.approveSupplierB(requestId),
    markManagementReviewReady: () => ctx.markManagementReviewReady(requestId),
  }
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>('procurement')
  const [state, dispatch] = React.useReducer(reducer, {})

  const roleValue = React.useMemo<RoleContextValue>(() => ({ role, setRole }), [role])

  const decisionValue = React.useMemo<DecisionContextValue>(
    () => ({
      getState: (requestId: string) => state[requestId] ?? DEFAULT_STATE,
      confirmCompatibility: (requestId) => dispatch({ type: 'confirm-compatibility', requestId }),
      requestPhysicalVerification: (requestId) =>
        dispatch({ type: 'request-physical-verification', requestId }),
      sendSupplierBToReview: (requestId) =>
        dispatch({ type: 'send-supplier-b-to-review', requestId }),
      approveSupplierB: (requestId) => dispatch({ type: 'approve-supplier-b', requestId }),
      markManagementReviewReady: (requestId) =>
        dispatch({ type: 'mark-management-review-ready', requestId }),
    }),
    [state],
  )

  return (
    <RoleContext.Provider value={roleValue}>
      <DecisionContext.Provider value={decisionValue}>{children}</DecisionContext.Provider>
    </RoleContext.Provider>
  )
}

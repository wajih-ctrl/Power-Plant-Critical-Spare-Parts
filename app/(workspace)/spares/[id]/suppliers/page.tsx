import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { SupplierDetailsAction, SupplierReviewAction } from '@/components/request/supplier-review-action'
import { getRequestById, SUPPLIERS } from '@/lib/mock-data'
import { RoleAccessBanner } from '@/components/role-access-banner'

export default async function SuppliersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const request = getRequestById(id)
  if (!request) notFound()

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-semibold tracking-[-0.03em]">Suppliers & procurement</h2><p className="mt-1 text-sm text-muted-foreground">Compare purchase history, supplier qualification, commercial terms and delivery timing.</p></div>
      <RoleAccessBanner permission="review-supplier" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{[['Previous Supplier','OEM Supplier'],['Previous Purchase','18 Aug 2021'],['Historical Price','$8,500'],['Previous Lead Time','10 weeks'],['Previous PO','PO-2021-1084'],['Contract','FA-17']].map(([label,value])=><div key={label} className="rounded-xl border border-border bg-card p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div>
      <div className="rounded-2xl border border-warning/25 bg-warning/[0.07] p-4"><p className="text-sm font-semibold">Historical price — not current commercial validity</p><div className="mt-3 flex flex-wrap gap-6"><span><small className="text-muted-foreground">2021 price</small><strong className="ml-2">$8,500</strong></span><span><small className="text-muted-foreground">Current OEM</small><strong className="ml-2">$12,400</strong></span><span><small className="text-muted-foreground">Difference</small><strong className="ml-2 text-destructive">+$3,900 · +45.9%</strong></span></div></div>
      <Card>
        <CardHeader>
          <CardTitle>Supplier Comparison</CardTitle>
          <CardDescription>
            Required before {new Date(request.requiredDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>OEM Specific</TableHead>
                <TableHead>Exclusive</TableHead>
                <TableHead>Alternative Allowed</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Meets Required Date</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Open PO</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUPPLIERS.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                  <TableCell className="text-muted-foreground">{supplier.type}</TableCell>
                  <TableCell>{supplier.type === 'OEM' ? 'Yes' : 'No'}</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.qualification} />
                  </TableCell>
                  <TableCell className="tabular">{currency.format(supplier.price)}</TableCell>
                  <TableCell className="tabular">{supplier.leadTimeWeeks} wks</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={supplier.canMeetRequiredDate}
                      tone={
                        supplier.canMeetRequiredDate === 'Yes'
                          ? 'success'
                          : supplier.canMeetRequiredDate === 'No'
                            ? 'destructive'
                            : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.contract ? supplier.contractRef : 'No active contract'}
                  </TableCell>
                  <TableCell>{supplier.openPo ?? 'None'}</TableCell>
                  <TableCell><span className="font-medium">{supplier.source}</span>{supplier.source==='International'&&<span className="mt-1 block text-xs text-muted-foreground">Import · Customs · Payment</span>}</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {supplier.id === 'sup-b' ? (
                      <SupplierReviewAction requestId={id} />
                    ) : (
                      <SupplierDetailsAction name={supplier.name} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

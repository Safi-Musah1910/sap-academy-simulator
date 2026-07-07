import { Plus, Save, Trash2 } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { createCompany, deleteCompany, updateCompany } from "@/server/company-actions";

export default async function CompanyCodePage() {
  const [companies, variants] = await Promise.all([
    prisma.company.findMany({
      include: { fiscalYearVariant: true },
      orderBy: { code: "asc" },
    }),
    prisma.fiscalYearVariant.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <AppShell activePath="/company-code">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Enterprise structure</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Company Code</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create and maintain legal entities used by the training ledger, partner, and reporting scenarios.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-500">{companies.length} records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create company code</CardTitle>
            <CardDescription>Use four-character codes and ISO country/currency values.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCompany} className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
              <Field label="Code" name="code" placeholder="4000" maxLength={4} />
              <Field label="Name" name="name" placeholder="SAP Academy Canada" className="xl:col-span-2" />
              <Field label="City" name="city" placeholder="Toronto" />
              <Field label="Country" name="country" placeholder="CA" maxLength={2} />
              <Field label="Currency" name="currency" placeholder="CAD" maxLength={3} />
              <div className="space-y-2">
                <Label htmlFor="fiscalYearVariantId">Fiscal year</Label>
                <select
                  id="fiscalYearVariantId"
                  name="fiscalYearVariantId"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <Plus />
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintain company codes</CardTitle>
            <CardDescription>Update organizational attributes or remove unused training entities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Fiscal year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <form id={`update-${company.id}`} action={updateCompany} />
                        <input form={`update-${company.id}`} type="hidden" name="id" value={company.id} />
                        <Input form={`update-${company.id}`} name="code" defaultValue={company.code} maxLength={4} />
                      </TableCell>
                      <TableCell>
                        <Input form={`update-${company.id}`} name="name" defaultValue={company.name} />
                      </TableCell>
                      <TableCell>
                        <Input form={`update-${company.id}`} name="city" defaultValue={company.city} />
                      </TableCell>
                      <TableCell>
                        <Input form={`update-${company.id}`} name="country" defaultValue={company.country} maxLength={2} />
                      </TableCell>
                      <TableCell>
                        <Input form={`update-${company.id}`} name="currency" defaultValue={company.currency} maxLength={3} />
                      </TableCell>
                      <TableCell>
                        <select
                          form={`update-${company.id}`}
                          name="fiscalYearVariantId"
                          defaultValue={company.fiscalYearVariantId ?? ""}
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">None</option>
                          {variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.code}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          form={`update-${company.id}`}
                          name="status"
                          defaultValue={company.status}
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option>Active</option>
                          <option>Training Only</option>
                          <option>Archived</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button form={`update-${company.id}`} type="submit" variant="outline" size="sm">
                            <Save />
                            Save
                          </Button>
                          <form action={deleteCompany}>
                            <input type="hidden" name="id" value={company.id} />
                            <Button type="submit" variant="destructive" size="sm">
                              <Trash2 />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  name,
  className,
  ...props
}: {
  label: string;
  name: string;
  className?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

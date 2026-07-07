import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentJournalEntry } from "@/server/dashboard-queries";

type RecentJournalEntriesTableProps = {
  entries: RecentJournalEntry[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function RecentJournalEntriesTable({ entries }: RecentJournalEntriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Journal Entries</CardTitle>
        <CardDescription>Latest 10 accounting documents posted in the simulator.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Document No.</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Posting Date</TableHead>
                <TableHead>Header Text</TableHead>
                <TableHead>Lines</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-slate-500">
                    No journal entries have been posted yet.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => {
                  const debitTotal = entry.lines.reduce((sum, line) => sum + line.debit, 0);

                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-semibold text-blue-800">
                        {entry.documentNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className="w-fit">{entry.company.code}</Badge>
                          <span className="text-xs text-slate-500">{entry.company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{dateFormatter.format(entry.postingDate)}</TableCell>
                      <TableCell className="max-w-[260px] truncate">{entry.headerText}</TableCell>
                      <TableCell>{entry.lines.length}</TableCell>
                      <TableCell className="text-right font-medium text-slate-950">
                        {currencyFormatter.format(debitTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

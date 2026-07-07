import { AppShell } from "@/components/dashboard/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <AppShell activePath="/">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="h-36 animate-pulse rounded-lg border border-blue-100 bg-white" />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="h-32 animate-pulse bg-slate-50" />
            </Card>
          ))}
        </section>
        <Card>
          <CardHeader>
            <div className="h-5 w-56 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded-lg bg-slate-50" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

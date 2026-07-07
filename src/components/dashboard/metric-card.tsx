import type { ComponentType } from "react";

import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: number;
  detail: string;
  icon: ComponentType<{ className?: string }>;
};

export function MetricCard({ title, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex min-h-32 items-center gap-4 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {value.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

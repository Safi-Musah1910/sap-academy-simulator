import { Info } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { ImgCustomizingWorkspace } from "@/components/sap-reference/img-customizing-workspace";
import { Badge } from "@/components/ui/badge";

export default function ImplementationGuidePage() {
  return (
    <AppShell activePath="/implementation-guide">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            <Badge>IMG-inspired training workspace</Badge>
            <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
              Implementation Guide Reference
            </h2>
            <p className="max-w-4xl text-sm leading-6 text-slate-600">
              This view mirrors the structure and density of a classic implementation activities
              screen while using original simulator styling. It helps learners understand how FICO
              configuration topics are organized before they practice the tasks.
            </p>
            <div className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Info className="mt-0.5 size-4 text-blue-700" />
              No SAP logos or proprietary UI assets are used. This is a training reference layout.
            </div>
          </div>
        </section>

        <ImgCustomizingWorkspace />
      </div>
    </AppShell>
  );
}

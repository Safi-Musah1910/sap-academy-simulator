import { MonitorCog } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { InteractiveLearningMode } from "@/components/learning/interactive-learning-mode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const connections = [
  {
    name: "S4HANA Training Client 800",
    systemDescription: "SAP Academy S/4HANA Finance Sandbox",
    sid: "S4A",
    groupServer: "PUBLIC / s4hana-academy.example",
    instance: "00",
    messageServer: "msg-s4a.academy.example",
    router: "/H/router.academy.example/S/3299",
  },
];

export default function SapGuiReferencePage() {
  return (
    <AppShell activePath="/sap-gui-reference">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge>Reference mode</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                SAP GUI Reference Mode
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Learn how a classic enterprise system selector is organized before practicing FICO
                configuration and posting tasks. This page recreates the concept with original web
                UI components and training data.
              </p>
            </div>
            <Button type="button">
              <MonitorCog />
              Log On
            </Button>
          </div>
        </section>

        <InteractiveLearningMode connections={connections} />
      </div>
    </AppShell>
  );
}

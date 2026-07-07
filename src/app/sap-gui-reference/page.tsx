import {
  BookOpenCheck,
  CheckCircle2,
  KeyRound,
  MonitorCog,
  Network,
  Server,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const learningItems = [
  {
    title: "SAP Logon",
    icon: MonitorCog,
    text: "SAP Logon is the desktop entry point many users use to choose a configured SAP system and start a session.",
  },
  {
    title: "SID",
    icon: KeyRound,
    text: "The System ID is a short identifier for an SAP system, commonly three characters such as S4A, DEV, QAS, or PRD.",
  },
  {
    title: "Server and group",
    icon: Server,
    text: "The server or logon group tells the client where to connect and can distribute users across application servers.",
  },
  {
    title: "Instance",
    icon: Network,
    text: "The instance number identifies the SAP application server instance, often shown as 00, 01, or 02.",
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
                Learn how a classic enterprise system selector is organized before practicing
                configuration tasks in the simulator. This page recreates the concept with original
                web UI components and training data.
              </p>
            </div>
            <Button type="button">
              <MonitorCog />
              Log On
            </Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader className="border-b border-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Connection list</CardTitle>
                  <CardDescription>
                    Training systems available to launch from the reference selector.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  1 system ready
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-blue-700 text-white">
                      <Server className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">SAP Logon style workspace</p>
                      <p className="text-xs text-slate-500">Connection groups, system IDs, and routes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" type="button">
                    New connection
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>System Description</TableHead>
                      <TableHead>SID</TableHead>
                      <TableHead>Group/Server</TableHead>
                      <TableHead>Instance</TableHead>
                      <TableHead>Message Server</TableHead>
                      <TableHead>Router</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.map((connection) => (
                      <TableRow key={connection.sid} className="bg-blue-50/50">
                        <TableCell className="font-semibold text-blue-800">
                          {connection.name}
                        </TableCell>
                        <TableCell>{connection.systemDescription}</TableCell>
                        <TableCell>
                          <Badge>{connection.sid}</Badge>
                        </TableCell>
                        <TableCell>{connection.groupServer}</TableCell>
                        <TableCell>{connection.instance}</TableCell>
                        <TableCell>{connection.messageServer}</TableCell>
                        <TableCell className="font-mono text-xs">{connection.router}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Select the S/4HANA training system, then use Log On to continue the learning flow.
                </p>
                <Button type="button" className="sm:w-auto">
                  <MonitorCog />
                  Log On
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <BookOpenCheck className="size-5" />
              </div>
              <CardTitle>Learning panel</CardTitle>
              <CardDescription>
                Key terms you will see when working with SAP GUI-style connection entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-md bg-slate-100 text-blue-700">
                        <Icon className="size-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  MonitorCog,
  Server,
  Trophy,
  XCircle,
} from "lucide-react";

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
import { cn } from "@/lib/utils";

export type LearningMode = "learn" | "practice" | "challenge";

export type SapGuiConnection = {
  name: string;
  systemDescription: string;
  sid: string;
  groupServer: string;
  instance: string;
  messageServer: string;
  router: string;
};

type FieldExplanation = {
  key: keyof Pick<
    SapGuiConnection,
    "sid" | "groupServer" | "instance" | "messageServer" | "router"
  >;
  label: string;
  value: string;
  summary: string;
  businessNote: string;
};

type InteractiveLearningModeProps = {
  connections: SapGuiConnection[];
};

const modes: Array<{
  id: LearningMode;
  label: string;
  description: string;
  icon: typeof BookOpenCheck;
}> = [
  {
    id: "learn",
    label: "Learn",
    description: "Plain-English explanations",
    icon: BookOpenCheck,
  },
  {
    id: "practice",
    label: "Practice",
    description: "Guided task with hints",
    icon: GraduationCap,
  },
  {
    id: "challenge",
    label: "Challenge",
    description: "Try it from memory",
    icon: Trophy,
  },
];

export function InteractiveLearningMode({ connections }: InteractiveLearningModeProps) {
  const [mode, setMode] = useState<LearningMode>("learn");
  const [selectedSid, setSelectedSid] = useState<string | null>(null);
  const [logonAttempted, setLogonAttempted] = useState(false);
  const [inspectedField, setInspectedField] = useState<FieldExplanation["key"]>("sid");
  const [challengeFinished, setChallengeFinished] = useState(false);

  const targetConnection = connections[0];
  const selectedConnection = connections.find((connection) => connection.sid === selectedSid);
  const selectedTarget = selectedSid === targetConnection?.sid;
  const taskComplete = Boolean(selectedTarget && logonAttempted);

  const fieldExplanations = useMemo<FieldExplanation[]>(() => {
    if (!targetConnection) {
      return [];
    }

    return [
      {
        key: "sid",
        label: "SID",
        value: targetConnection.sid,
        summary:
          "The System ID is the short technical name of an SAP system. Teams use it to distinguish development, test, and production systems.",
        businessNote:
          "Choosing the right SID prevents users from posting training data into a production system or testing in the wrong environment.",
      },
      {
        key: "groupServer",
        label: "Server",
        value: targetConnection.groupServer,
        summary:
          "The server or logon group tells the client where to connect and can route users to an available application server.",
        businessNote:
          "Load-balanced groups keep large finance and operations teams productive during peak periods such as month-end close.",
      },
      {
        key: "instance",
        label: "Instance",
        value: targetConnection.instance,
        summary:
          "The instance number identifies the SAP application server process. It is commonly shown as 00, 01, or another two-digit value.",
        businessNote:
          "Basis teams use instances to manage capacity, maintenance windows, and technical troubleshooting.",
      },
      {
        key: "messageServer",
        label: "Message Server",
        value: targetConnection.messageServer,
        summary:
          "The message server coordinates logon groups and helps clients find an available application server.",
        businessNote:
          "It supports reliable access when many users log in across departments and locations.",
      },
      {
        key: "router",
        label: "Router",
        value: targetConnection.router,
        summary:
          "The router string describes the network route used to reach an SAP system through controlled network hops.",
        businessNote:
          "A route helps secure access between corporate networks, hosted systems, and support connections.",
      },
    ];
  }, [targetConnection]);

  const activeField = fieldExplanations.find((field) => field.key === inspectedField);
  const score = (selectedTarget ? 50 : 0) + (taskComplete ? 50 : 0);

  function switchMode(nextMode: LearningMode) {
    setMode(nextMode);
    setSelectedSid(null);
    setLogonAttempted(false);
    setChallengeFinished(false);
  }

  function handleLogOn() {
    setLogonAttempted(true);
    if (mode === "challenge") {
      setChallengeFinished(true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ModeSwitcher currentMode={mode} onModeChange={switchMode} />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ConnectionWorkspace
          connections={connections}
          mode={mode}
          selectedSid={selectedSid}
          selectedConnectionName={selectedConnection?.name}
          onSelect={setSelectedSid}
          onLogOn={handleLogOn}
          taskComplete={taskComplete}
          logonAttempted={logonAttempted}
          challengeFinished={challengeFinished}
          score={score}
        />

        <LearningPanel
          mode={mode}
          fields={fieldExplanations}
          activeField={activeField}
          inspectedField={inspectedField}
          onInspectField={setInspectedField}
          selectedTarget={selectedTarget}
          logonAttempted={logonAttempted}
          taskComplete={taskComplete}
          challengeFinished={challengeFinished}
          score={score}
        />
      </section>
    </div>
  );
}

function ModeSwitcher({
  currentMode,
  onModeChange,
}: {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
}) {
  return (
    <Card>
      <CardContent className="grid gap-3 p-3 md:grid-cols-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "flex min-h-20 items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                isActive
                  ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-md",
                  isActive ? "bg-blue-700 text-white" : "bg-slate-100 text-blue-700",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{mode.label} Mode</span>
                <span className="mt-1 block text-xs">{mode.description}</span>
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ConnectionWorkspace({
  connections,
  mode,
  selectedSid,
  selectedConnectionName,
  onSelect,
  onLogOn,
  taskComplete,
  logonAttempted,
  challengeFinished,
  score,
}: {
  connections: SapGuiConnection[];
  mode: LearningMode;
  selectedSid: string | null;
  selectedConnectionName?: string;
  onSelect: (sid: string) => void;
  onLogOn: () => void;
  taskComplete: boolean;
  logonAttempted: boolean;
  challengeFinished: boolean;
  score: number;
}) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Connection list</CardTitle>
            <CardDescription>
              Select the training S/4HANA system and start a simulated logon.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            <CheckCircle2 className="size-4 text-emerald-600" />
            {connections.length} system ready
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
                <p className="text-xs text-slate-500">
                  Connection groups, system IDs, instances, and routes
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" type="button">
              New connection
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[1120px]">
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
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
              {connections.map((connection) => {
                const isSelected = selectedSid === connection.sid;

                return (
                  <TableRow
                    key={connection.sid}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-blue-50 hover:bg-blue-50",
                    )}
                    onClick={() => onSelect(connection.sid)}
                  >
                    <TableCell>
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected ? <CheckCircle2 className="size-3.5" /> : null}
                      </span>
                    </TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <TaskFeedback
            mode={mode}
            selectedConnectionName={selectedConnectionName}
            logonAttempted={logonAttempted}
            taskComplete={taskComplete}
            challengeFinished={challengeFinished}
            score={score}
          />
          <Button type="button" className="w-full lg:w-auto" onClick={onLogOn}>
            <MonitorCog />
            Log On
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskFeedback({
  mode,
  selectedConnectionName,
  logonAttempted,
  taskComplete,
  challengeFinished,
  score,
}: {
  mode: LearningMode;
  selectedConnectionName?: string;
  logonAttempted: boolean;
  taskComplete: boolean;
  challengeFinished: boolean;
  score: number;
}) {
  if (mode === "learn") {
    return (
      <p className="text-sm text-slate-500">
        In Learn Mode, inspect each connection field to understand what it controls.
      </p>
    );
  }

  if (mode === "practice") {
    if (taskComplete) {
      return (
        <div className="flex items-start gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 size-4" />
          Success. You selected the S/4HANA system and launched the logon action.
        </div>
      );
    }

    if (logonAttempted) {
      return (
        <div className="flex items-start gap-2 text-sm text-amber-700">
          <HelpCircle className="mt-0.5 size-4" />
          Select the S/4HANA Training Client 800 row before clicking Log On.
        </div>
      );
    }

    return (
      <div className="flex items-start gap-2 text-sm text-blue-700">
        <Lightbulb className="mt-0.5 size-4" />
        Hint: choose the row with SID S4A, then click Log On.
      </div>
    );
  }

  if (!challengeFinished) {
    return (
      <p className="text-sm text-slate-500">
        Challenge task: select the correct system from memory, then click Log On.
      </p>
    );
  }

  return (
    <div className="flex items-start gap-2 text-sm">
      {taskComplete ? (
        <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 size-4 text-red-600" />
      )}
      <span className={taskComplete ? "text-emerald-700" : "text-red-700"}>
        Score: {score}/100.{" "}
        {taskComplete
          ? `Correct. ${selectedConnectionName} is the S/4HANA training system.`
          : "Review the SID and system description, then try the challenge again."}
      </span>
    </div>
  );
}

function LearningPanel({
  mode,
  fields,
  activeField,
  inspectedField,
  onInspectField,
  selectedTarget,
  logonAttempted,
  taskComplete,
  challengeFinished,
  score,
}: {
  mode: LearningMode;
  fields: FieldExplanation[];
  activeField?: FieldExplanation;
  inspectedField: FieldExplanation["key"];
  onInspectField: (field: FieldExplanation["key"]) => void;
  selectedTarget: boolean;
  logonAttempted: boolean;
  taskComplete: boolean;
  challengeFinished: boolean;
  score: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <BookOpenCheck className="size-5" />
        </div>
        <CardTitle>
          {mode === "learn"
            ? "Learn the fields"
            : mode === "practice"
              ? "Practice task"
              : "Challenge score"}
        </CardTitle>
        <CardDescription>
          {mode === "learn"
            ? "Field-by-field explanations with business context."
            : mode === "practice"
              ? "Complete the logon task with guided feedback."
              : "Complete the task without hints and review your score."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "learn" ? (
          <LearnModePanel
            fields={fields}
            activeField={activeField}
            inspectedField={inspectedField}
            onInspectField={onInspectField}
          />
        ) : null}

        {mode === "practice" ? (
          <PracticeModePanel
            selectedTarget={selectedTarget}
            logonAttempted={logonAttempted}
            taskComplete={taskComplete}
          />
        ) : null}

        {mode === "challenge" ? (
          <ChallengeModePanel
            challengeFinished={challengeFinished}
            selectedTarget={selectedTarget}
            logonAttempted={logonAttempted}
            score={score}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

function LearnModePanel({
  fields,
  activeField,
  inspectedField,
  onInspectField,
}: {
  fields: FieldExplanation[];
  activeField?: FieldExplanation;
  inspectedField: FieldExplanation["key"];
  onInspectField: (field: FieldExplanation["key"]) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            onClick={() => onInspectField(field.key)}
            className={cn(
              "rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors",
              inspectedField === field.key
                ? "border-blue-200 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            {field.label}
          </button>
        ))}
      </div>

      {activeField ? (
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-950">{activeField.label}</h3>
            <Badge>{activeField.value}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{activeField.summary}</p>
          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-blue-800">
              Why this matters in real business
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-900">{activeField.businessNote}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PracticeModePanel({
  selectedTarget,
  logonAttempted,
  taskComplete,
}: {
  selectedTarget: boolean;
  logonAttempted: boolean;
  taskComplete: boolean;
}) {
  const steps = [
    {
      label: "Select the S/4HANA system row",
      complete: selectedTarget,
    },
    {
      label: "Click Log On",
      complete: logonAttempted,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">
          Practice task: Select the S/4HANA system and click Log On.
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-800">
          Use the field values to identify the correct system. The SID should be S4A.
        </p>
      </div>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2 text-sm text-slate-700">
            {step.complete ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : (
              <HelpCircle className="size-4 text-slate-400" />
            )}
            {step.label}
          </div>
        ))}
      </div>
      {taskComplete ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Great work. You completed the guided SAP GUI logon task.
        </div>
      ) : null}
    </div>
  );
}

function ChallengeModePanel({
  challengeFinished,
  selectedTarget,
  logonAttempted,
  score,
}: {
  challengeFinished: boolean;
  selectedTarget: boolean;
  logonAttempted: boolean;
  score: number;
}) {
  if (!challengeFinished) {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-950">Challenge task</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          From memory, select the S/4HANA training system and click Log On. No hints are shown in
          this mode.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">Final score</p>
          <Badge>{score}/100</Badge>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            {selectedTarget ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : (
              <XCircle className="size-4 text-red-600" />
            )}
            Correct system selected: {selectedTarget ? "Yes" : "No"}
          </div>
          <div className="flex items-center gap-2">
            {logonAttempted ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : (
              <XCircle className="size-4 text-red-600" />
            )}
            Log On clicked: {logonAttempted ? "Yes" : "No"}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "rounded-lg border p-4 text-sm",
          score === 100
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-800",
        )}
      >
        {score === 100
          ? "Excellent. You identified and launched the S/4HANA training system from memory."
          : "Review Learn Mode, then retry the challenge. Focus on the S4A SID and S/4HANA system description."}
      </div>
    </div>
  );
}

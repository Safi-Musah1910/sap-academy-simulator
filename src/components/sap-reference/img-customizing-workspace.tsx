"use client";

import { useState } from "react";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileClock,
  Filter,
  FolderTree,
  GitCompare,
  Layers3,
  ListTree,
  Search,
  Settings2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ImgNode = {
  id: string;
  label: string;
  level: number;
  kind: "folder" | "activity";
  expanded?: boolean;
  selected?: boolean;
  children?: ImgNode[];
};

const imgTree: ImgNode[] = [
  {
    id: "root",
    label: "FICO Customizing Implementation Guide",
    level: 0,
    kind: "folder",
    expanded: true,
    children: [
      { id: "business-functions", label: "Activate Business Functions", level: 1, kind: "activity" },
      { id: "conversion", label: "Conversion of Accounting to S/4HANA", level: 1, kind: "folder" },
      { id: "abap", label: "ABAP Platform", level: 1, kind: "folder" },
      {
        id: "enterprise-structure",
        label: "Enterprise Structure",
        level: 1,
        kind: "folder",
        children: [
          { id: "define-company", label: "Define Company", level: 2, kind: "activity" },
          { id: "define-company-code", label: "Edit, Copy, Delete, Check Company Code", level: 2, kind: "activity" },
          { id: "assign-company-code", label: "Assign Company Code to Company", level: 2, kind: "activity" },
        ],
      },
      {
        id: "financial-accounting",
        label: "Financial Accounting",
        level: 1,
        kind: "folder",
        expanded: true,
        selected: true,
        children: [
          { id: "global-settings", label: "Financial Accounting Global Settings", level: 2, kind: "folder" },
          { id: "general-ledger", label: "General Ledger Accounting", level: 2, kind: "folder" },
          { id: "ar-ap", label: "Accounts Receivable and Accounts Payable", level: 2, kind: "folder" },
          { id: "contract-ar-ap", label: "Contract Accounts Receivable and Payable", level: 2, kind: "folder" },
          { id: "bank-accounting", label: "Bank Accounting", level: 2, kind: "folder" },
          { id: "revenue-accounting", label: "Revenue Accounting", level: 2, kind: "folder" },
          { id: "consolidation-prep", label: "Consolidation Preparation", level: 2, kind: "folder" },
          { id: "real-time-consolidation", label: "Real-Time Consolidation", level: 2, kind: "folder" },
          { id: "asset-accounting", label: "Asset Accounting", level: 2, kind: "folder" },
          { id: "special-ledger", label: "Special Purpose Ledger", level: 2, kind: "folder" },
          { id: "central-finance", label: "Central Finance", level: 2, kind: "folder" },
          { id: "predictive-accounting", label: "Predictive Accounting", level: 2, kind: "folder" },
          { id: "tax-framework", label: "Corporate Income Tax Framework", level: 2, kind: "folder" },
        ],
      },
      { id: "supply-chain-finance", label: "Financial Supply Chain Management", level: 1, kind: "folder" },
      { id: "multi-bank", label: "Multi-Bank Connectivity Connector", level: 1, kind: "folder" },
    ],
  },
];

const toolbarItems = [
  { label: "Existing BC Sets", icon: Layers3 },
  { label: "Apply Filter", icon: Filter },
  { label: "Change Log", icon: FileClock },
  { label: "Compare", icon: GitCompare },
  { label: "Where Else Used", icon: Search },
];

export function ImgCustomizingWorkspace() {
  const [selectedId, setSelectedId] = useState("financial-accounting");

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-300 bg-slate-700 text-white">
        <div className="flex h-11 items-center gap-5 overflow-x-auto px-4 text-sm font-medium">
          <span className="shrink-0">Implementation Activities</span>
          <span className="shrink-0">Edit</span>
          <span className="shrink-0">Goto</span>
          <span className="shrink-0">Additional Information</span>
          <span className="shrink-0">Utilities</span>
          <span className="shrink-0">System</span>
          <span className="shrink-0">Help</span>
        </div>
      </div>

      <div className="border-b border-slate-300 bg-slate-600 text-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-500 hover:text-white">
              <ChevronRight className="rotate-180" />
            </Button>
            <div className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-bold tracking-normal text-white">
              FICO
            </div>
          </div>
          <h2 className="truncate text-lg font-semibold">Display IMG</h2>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex h-10 min-w-0 items-center rounded-md border border-slate-300 bg-white px-3 xl:w-72">
            <span className="mr-2 text-xs font-semibold text-slate-400">/n</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
              defaultValue="SPRO"
              aria-label="Command field"
            />
            <ChevronDown className="size-4 text-slate-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {toolbarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.label} variant="ghost" size="sm" className="shrink-0">
                  <Icon />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid min-h-[620px] lg:grid-cols-[1fr_340px]">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[44px_1fr_150px_150px] border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
              <span />
              <span>Structure</span>
              <span>Activity Type</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-100">
              {imgTree.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-4 lg:border-l lg:border-t-0">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <BookOpenCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-950">How to read IMG</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The Implementation Guide is a configuration map. Consultants expand folders,
                  choose activities, and maintain settings that control how finance processes behave.
                </p>
              </div>
              <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-semibold uppercase text-blue-800">Training focus</p>
                <p className="mt-2 text-sm leading-6 text-blue-900">
                  Start with Financial Accounting, then move into global settings, G/L, AP, AR, bank
                  accounting, asset accounting, and close/reporting topics.
                </p>
              </div>
              <div className="space-y-2">
                <Badge>SPRO-style navigation</Badge>
                <Badge className="border-slate-200 bg-white text-slate-600">Original training UI</Badge>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
}: {
  node: ImgNode;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const isSelected = selectedId === node.id || node.selected;
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = node.expanded || node.id === "root" || node.id === "financial-accounting";

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn(
          "grid w-full grid-cols-[44px_1fr_150px_150px] items-center px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50",
          isSelected && "bg-blue-50 text-blue-900",
        )}
      >
        <span className="flex items-center justify-center">
          <span className="size-4 rounded border border-slate-300 bg-white" />
        </span>
        <span className="flex min-w-0 items-center gap-2" style={{ paddingLeft: node.level * 28 }}>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="size-4 shrink-0 text-slate-500" />
            ) : (
              <ChevronRight className="size-4 shrink-0 text-slate-500" />
            )
          ) : (
            <span className="size-4 shrink-0" />
          )}
          {node.kind === "folder" ? (
            <FolderTree className="size-4 shrink-0 text-blue-700" />
          ) : (
            <ClipboardList className="size-4 shrink-0 text-slate-500" />
          )}
          <span className={cn("truncate", isSelected && "font-semibold")}>{node.label}</span>
        </span>
        <span className="text-xs text-slate-500">{node.kind === "folder" ? "Node" : "Activity"}</span>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          {node.kind === "folder" ? (
            <ListTree className="size-3.5" />
          ) : (
            <Settings2 className="size-3.5" />
          )}
          Available
        </span>
      </button>
      {hasChildren && isExpanded
        ? node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  );
}

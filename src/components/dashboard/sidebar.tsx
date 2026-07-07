import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, active: true },
  { label: "Company Code", href: "/company-code", icon: Building2 },
  { label: "Fiscal Year Variants", href: "#", icon: CalendarDays },
  { label: "Chart of Accounts", href: "#", icon: FileSpreadsheet },
  { label: "General Ledger", href: "#", icon: Landmark },
  { label: "Accounts Payable", href: "#", icon: ReceiptText },
  { label: "Accounts Receivable", href: "#", icon: CircleDollarSign },
  { label: "Reports", href: "#", icon: BarChart3 },
  { label: "Training", href: "#", icon: BookOpen },
];

export function Sidebar({ activePath = "/" }: { activePath?: string }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-blue-100 bg-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-blue-100 px-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-700 text-white">
          <ScrollText className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">SAP Academy</p>
          <p className="text-xs text-slate-500">Simulator</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href || (item.active && activePath === "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700",
                isActive && "bg-blue-50 text-blue-800",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { items as navigationItems };

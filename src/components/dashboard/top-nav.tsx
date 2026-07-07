import { Bell, Search, Settings, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/server/auth-actions";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-blue-100 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-normal text-blue-700">
          Finance and controlling learning workspace
        </p>
        <h1 className="text-lg font-semibold text-slate-950">SAP FICO Training Platform</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings />
        </Button>
        <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 sm:flex">
          <UserRound className="size-4 text-blue-700" />
          <span className="text-sm font-medium text-slate-700">FICO Learner</span>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}

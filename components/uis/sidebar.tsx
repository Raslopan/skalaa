"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { modules } from "@/lib/mock-data";
import {
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wrench,
  Home,
  Settings,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wrench,
  Building2,
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function UisSidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-semibold">StayHub Admin</span>
          </Link>
        )}
        {collapsed && (
          <Building2 className="mx-auto h-6 w-6 text-sidebar-primary" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        <Link
          href="/explore"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>View Guest Site</span>}
        </Link>

        <div className={cn("my-4 border-t border-sidebar-border", collapsed && "mx-2")} />

        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Modules
          </p>
        )}

        {modules.map((module) => {
          const Icon = iconMap[module.icon] || Calendar;
          const isActive = pathname === module.route;
          const isDisabled = !module.enabled;

          const content = (
            <>
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{module.name}</span>
                  {isDisabled && (
                    <Badge variant="secondary" className="text-xs">
                      Soon
                    </Badge>
                  )}
                </>
              )}
            </>
          );

          const baseClassName = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isDisabled && "cursor-not-allowed opacity-50",
            collapsed && "justify-center px-2"
          );

          if (isDisabled) {
            return (
              <span key={module.id} className={baseClassName}>
                {content}
              </span>
            );
          }

          return (
            <Link key={module.id} href={module.route} className={baseClassName}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}

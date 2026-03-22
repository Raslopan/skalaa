"use client";

import { useState } from "react";
import { UisSidebar } from "@/components/uis/sidebar";
import { cn } from "@/lib/utils";

export default function UisLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UisSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300"
        )}
      >
        {children}
      </main>
    </div>
  );
}

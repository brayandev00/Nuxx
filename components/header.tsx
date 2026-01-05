"use client";

import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-4 px-8 pt-6">
      {/* Note: Remove 'sticky' as TopBar is now the sticky element. 
           We keep this as a page header block. */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && <p className="text-zinc-400 mt-1">{subtitle}</p>}
        </div>

        {/* Page Actions (children) */}
        <div className="flex items-center gap-3">{children}</div>
      </div>
      <Separator className="bg-zinc-800" />
    </div>
  );
}

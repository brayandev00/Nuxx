"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  Search,
  PlusCircle,
  FileText,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { navItems } from "./sidebar";
import { useNuuxStore } from "@/lib/nuux-store";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { createPurchaseOrder, toggleFavorite, isFavorite } = useNuuxStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  const actions = [
    {
      label: "Nueva Orden de Compra",
      icon: PlusCircle,
      href: "/dashboard/procurement",
      type: "action" as const,
    },
    {
      label: "Subir Documento",
      icon: FileText,
      href: "/dashboard/documents",
      type: "action" as const,
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/dashboard/settings",
      type: "module" as const,
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Escribe un comando o busca..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>

        <CommandGroup heading="Módulos">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isFav = isFavorite(item.href);
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => runCommand(() => router.push(item.href))}
                className="group flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      label: item.label,
                      href: item.href,
                      type: "module",
                    });
                  }}
                  className={`rounded p-1 transition-colors hover:bg-zinc-800 ${
                    isFav
                      ? "text-yellow-400"
                      : "text-zinc-500 opacity-0 group-hover:text-yellow-400 group-hover:opacity-100"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${isFav ? "fill-yellow-400" : ""}`}
                  />
                </button>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Acciones Rápidas">
          {actions.map((action) => {
            const Icon = action.icon;
            const isFav = isFavorite(action.href);
            return (
              <CommandItem
                key={action.href}
                value={action.label}
                onSelect={() => runCommand(() => router.push(action.href))}
                className="group flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{action.label}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      label: action.label,
                      href: action.href,
                      type: action.type,
                    });
                  }}
                  className={`rounded p-1 transition-colors hover:bg-zinc-800 ${
                    isFav
                      ? "text-yellow-400"
                      : "text-zinc-500 opacity-0 group-hover:text-yellow-400 group-hover:opacity-100"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${isFav ? "fill-yellow-400" : ""}`}
                  />
                </button>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

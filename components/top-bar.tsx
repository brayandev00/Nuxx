"use client";

import { useState } from "react";
import { Bell, Search, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTenant } from "@/lib/tenant-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchCommand } from "./search-command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNuuxStore } from "@/lib/nuux-store";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
  const { currentUser, currentRole, currentTenant, logout } = useTenant();
  const [openSearch, setOpenSearch] = useState(false);
  const { favorites } = useNuuxStore();
  const router = useRouter();

  // Mock Notifications
  const notifications = [
    {
      id: 1,
      title: "Nueva Orden de Compra",
      desc: "La orden #PO-992 requiere tu aprobación.",
      time: "Hace 5 min",
      type: "info", // info, success, warning
      read: false,
    },
    {
      id: 2,
      title: "Stock Bajo: Laptop HP",
      desc: "El stock ha caído por debajo del mínimo (3 uds).",
      time: "Hace 1 hora",
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "Sincronización Completada",
      desc: "Los documentos de Google Drive se han actualizado.",
      time: "Hace 2 horas",
      type: "success",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="h-16 border-b border-border bg-[#09090b]/80 backdrop-blur-md px-6 grid grid-cols-3 items-center sticky top-0 z-50">
        {/* Left Area (Empty for now / Breadcrumbs) */}
        <div className="flex items-center justify-start">
          {/* Future Breadcrumbs or Title */}
        </div>

        {/* Search Bar - CENTERED */}
        <div className="flex items-center justify-center w-full">
          <Button
            variant="outline"
            className="relative w-full max-w-md justify-start text-sm text-muted-foreground bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 hover:text-primary transition-all rounded-xl h-10 px-4 group"
            onClick={() => setOpenSearch(true)}
          >
            <Search className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
            Buscar en todo Nuux...
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-zinc-800 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-4">
          {/* Tenant Indicator */}
          {currentTenant && (
            <Badge
              variant="outline"
              className="hidden lg:flex gap-2 bg-zinc-900/50 border-zinc-800 py-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {currentTenant.name}
            </Badge>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[#09090b]" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 overflow-hidden bg-card border-border"
            >
              <div className="p-4 bg-secondary/30 border-b border-border">
                <h4 className="font-semibold text-sm">Notificaciones</h4>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-zinc-900 focus:bg-zinc-900 border-b border-border/50 last:border-0"
                    >
                      <div
                        className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          notif.read ? "bg-transparent" : "bg-primary"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium leading-none ${
                              !notif.read
                                ? "text-white"
                                : "text-muted-foreground"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notif.desc}
                        </p>
                      </div>
                      {notif.type === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {notif.type === "success" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      {notif.type === "info" && (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-2 border-t border-border bg-secondary/30 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full h-8"
                >
                  Marcar todas como leídas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="pl-2 pr-1 h-10 rounded-full gap-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-700"
              >
                <Avatar className="w-7 h-7 border border-zinc-700">
                  {/* <AvatarImage src={currentUser?.avatar} /> */}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs mr-2 hidden sm:flex">
                  <span className="font-medium text-zinc-200">
                    {currentUser?.name?.split(" ")[0] || "Usuario"}
                  </span>
                  <span className="text-zinc-500 capitalize">
                    {currentRole?.name || "Admin"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border"
            >
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>

              {favorites.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Favoritos
                  </DropdownMenuLabel>
                  {favorites.map((fav) => (
                    <DropdownMenuItem
                      key={fav.href}
                      onClick={() => router.push(fav.href)}
                      className="cursor-pointer"
                    >
                      <Star className="w-3 h-3 mr-2 text-yellow-400 fill-yellow-400" />
                      {fav.label}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                onClick={logout}
              >
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchCommand open={openSearch} onOpenChange={setOpenSearch} />
    </>
  );
}

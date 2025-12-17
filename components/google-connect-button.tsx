"use client"

import { useGoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { HardDrive, RefreshCw, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface GoogleConnectButtonProps {
    onSuccess: (tokenResponse: any) => void
    isConnected?: boolean
    onDisconnect?: () => void
}

function GoogleConnectButtonAuthenticated({ onSuccess, isConnected, onDisconnect }: GoogleConnectButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true)
            try {
                await onSuccess(tokenResponse)
            } catch (error) {
                toast.error("Error al conectar con Google Drive")
            } finally {
                setIsLoading(false)
            }
        },
        onError: () => {
            toast.error("Error en la autenticación de Google")
            setIsLoading(false)
        },
        // Implicit flow (default) returns access_token directly
        scope: "https://www.googleapis.com/auth/drive.readonly"
    })

    // Connected State UI
    if (isConnected) {
        return (
            <div className="px-2 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between group w-full">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-blue-200">Google Drive Sync</span>
                </div>
                {onDisconnect && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 text-zinc-500 hover:text-red-400 p-0"
                        onClick={onDisconnect}
                    >
                        <span className="sr-only">Desconectar</span>
                        ×
                    </Button>
                )}
            </div>
        )
    }

    // Connect Button UI
    return (
        <Button
            variant="outline"
            className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 justify-start"
            onClick={() => login()}
            disabled={isLoading}
        >
            {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <HardDrive className="w-4 h-4 mr-2 text-blue-500" />
            )}
            {isLoading ? "Conectando..." : "Conectar Google"}
        </Button>
    )
}

export function GoogleConnectButton(props: GoogleConnectButtonProps) {
    const hasClientId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!hasClientId) {
        return (
            <Button
                variant="outline"
                className="w-full border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/20 justify-start"
                onClick={() => toast.error("Configuración Faltante", { description: "Falta establecer NEXT_PUBLIC_GOOGLE_CLIENT_ID (Client ID) en el archivo .env" })}
            >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Configurar Google ID
            </Button>
        )
    }

    return <GoogleConnectButtonAuthenticated {...props} />
}

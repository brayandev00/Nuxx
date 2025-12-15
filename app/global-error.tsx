"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <div className="container max-w-md space-y-4 text-center">
                    <h1 className="text-4xl font-bold">Algo salio mal</h1>
                    <p className="text-muted-foreground">
                        Ocurrio un error critico en la aplicacion.
                    </p>
                    <div className="rounded-lg bg-destructive/10 p-4 font-mono text-sm text-destructive">
                        {error.message || "Error desconocido"}
                    </div>
                    <Button onClick={() => reset()} className="w-full">
                        Intentar de nuevo
                    </Button>
                </div>
            </body>
        </html>
    )
}

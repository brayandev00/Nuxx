import Image from "next/image"

export function NuuxLogo({ size = "default" }: { size?: "small" | "default" }) {
  return (
    <Image
      src="/nuux-logo.png"
      alt="Nuux Logo"
      width={size === "small" ? 48 : 80}
      height={size === "small" ? 48 : 80}
      className={size === "small" ? "w-12 h-12" : "w-20 h-20"}
      priority
    />
  )
}

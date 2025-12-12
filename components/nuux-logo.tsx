import Image from "next/image"

export function NuuxLogo({ size = "default" }: { size?: "small" | "default" }) {
  return (
    <Image
      src="/nuux-logo.png"
      alt="Nuux Logo"
      width={size === "small" ? 48 : 120}
      height={size === "small" ? 48 : 120}
      className={`${size === "small" ? "w-10 h-10" : "w-32 h-auto"} object-contain mix-blend-screen`}
      style={{ filter: "contrast(200%)" }}
      priority
    />
  )
}

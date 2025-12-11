export function NuuxLogo({
  className = "",
  size = "default",
}: { className?: string; size?: "small" | "default" | "large" }) {
  const sizes = {
    small: "h-6",
    default: "h-10",
    large: "h-16",
  }

  return (
    <img src="/images/nuux-logo.png" alt="Nuux Logo" className={`${sizes[size]} w-auto object-contain ${className}`} />
  )
}

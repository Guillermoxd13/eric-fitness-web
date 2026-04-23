import Link from "next/link";

export function Logo({
  href = "/",
  size = "md",
  className = "",
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-baseline gap-[4px] font-display font-extrabold leading-none tracking-editorial-lg ${sizes[size]} ${className}`}
    >
      <span>ERIC</span>
      <span className="inline-flex items-baseline">
        <span className="text-brand-500">/</span>
        <span>FIT</span>
      </span>
    </Link>
  );
}

import Link from "next/link";
import React from "react";

export default function LinkCard({
  href,
  label,
  icon,
  description,
  bgColor,
  textColor,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-[8rem] w-[8rem] flex-col items-center justify-center rounded-md bg-[var(--color-neutral-1)]"
    >
      <div className="h-[4rem] w-[4rem]">{icon}</div>
      {label}
    </Link>
  );
}

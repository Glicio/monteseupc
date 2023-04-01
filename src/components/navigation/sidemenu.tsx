import React from "react";

export const SideMenuButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="w-full px-2 text-left hover:text-[var(--color-contrast)]"
      onClick={() => {
        if (onClick) return onClick();
        return
      }}
    >
      {label}
    </button>
  );
};

export default function SideMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[var(--side-menu-width)] bg-[var(--color-neutral-2)] text-[var(--color-text-primary)]">
        {children}

    </div>
  );
}

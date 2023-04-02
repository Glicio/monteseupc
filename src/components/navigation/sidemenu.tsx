import React from "react";
import Arrow from "../svg/arrow";

export const SideMenuSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const [active, setActive] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setActive((old) => !old);
        }}
        className="flex items-center gap-2"
      >
        <Arrow side={active ? "down" : "right"} />
        <span>{label}</span>
      </button>
      <div className={active ? "pl-2" : "max-h-0 overflow-hidden"}>{children}</div>
    </div>
  );
};

export const SideMenuButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="w-full pl-4 text-left hover:text-[var(--color-contrast)]"
      onClick={() => {
        if (onClick) return onClick();
        return;
      }}
    >
      {label}
    </button>
  );
};

export default function SideMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[var(--side-menu-width)] bg-[var(--color-neutral-2)] text-[var(--color-text-primary)] pl-2">
      {children}
    </div>
  );
}

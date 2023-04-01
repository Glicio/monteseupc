import React from "react";
import UserButton from "../user/userButton";

export default function NavBar() {
  return (
    <header className="flex h-[var(--nav-bar-height)] items-center border-b border-[var(--color-neutral-1)] bg-[var(--color-primary)] px-2 text-[var(--color-text-primary)]">
      <h1 className="text-xl font-extrabold text-[var(--color-contrast)]">
        Logo
      </h1>
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
}

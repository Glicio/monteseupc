import React from "react";
import UserButton from "../user/userButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ShieldCheck from "../svg/shieldCheck";

export default function NavBar() {
  const { data: session, status } = useSession();
  return (
    <header className="flex h-[var(--nav-bar-height)] items-center border-b border-[var(--color-neutral-1)] bg-[var(--color-primary)] px-2 text-[var(--color-text-primary)]">
      <Link href={"/"}>
        <h1 className="text-xl font-extrabold text-[var(--color-contrast)]">
          Logo
        </h1>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {session?.user?.isAdmin ? (
          <Link href={"/admin/dashboard"}>
            <ShieldCheck />
          </Link>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}

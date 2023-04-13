import Link from "next/link";
import React from "react";
import Computer from "../svg/computer";
import { useRouter } from "next/router";
import Wrench from "../svg/wrench";
import Dollar from "../svg/dollar";
import Home from "../svg/home";

//the tabs selector that goes under the navbar

const Tab = ({
  link,
  icon,
  label,
  active,
}: {
  link: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => {
  return (
    <Link href={link} className="h-full w-16">
      <div
        className={"flex flex-col items-center h-full justify-center"}
        style={{
          backgroundColor: active ? "var(--color-neutral-1)" : "transparent",
          color: active ? "var(--color-contrast)" : "var(--color-text-primary)",
        }}
      >
        <div className="w-6 h-6">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default function TabsNav() {
  const router = useRouter();
  return (
    <nav className="flex px-2 h-[var(--tabs-nav-height)] items-center gap-2 border-b border-[var(--color-neutral-1)]">
        <Tab
        link={"/"}
        icon={<Home />}
        label="Início"
        active={router.pathname === "/"}
        />
      <Tab
        link={"/setups"}
        icon={<Computer />}
        label="Setups"
        active={router.pathname === "/setups"}
      />
        <Tab
        link={"/parts"}
        icon={<Wrench />}
        label="Peças"
        active={router.pathname === "/parts"}
        />

      <Tab
        link={"/deals"}  
        icon={<Dollar />}
        label="Ofertas"
        active={router.pathname === "/deals"}
        />
    </nav>
  );
}

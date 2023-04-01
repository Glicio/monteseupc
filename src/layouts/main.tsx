import React from "react";
import NavBar from "../components/navigation/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-var(--nav-bar-height))] flex flex-col">
        {children}
      </div>
    </>
  );
}

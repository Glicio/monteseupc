import React from "react";
import NavBar from "../components/navigation/navbar";
import TabsNav from "../components/navigation/tabsnav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <TabsNav />
      <div
        style={{
          minHeight:
            "calc(100vh - (var(--tabs-nav-height) + var(--nav-bar-height)))",
        }}
        className="flex flex-col"
      >
        {children}
      </div>
    </>
  );
}

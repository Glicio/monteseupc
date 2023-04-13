import React from "react";
import UserProfilePic from "./userPFP";
import { signIn, signOut, useSession } from "next-auth/react";
import UserCircle from "../svg/userCircle";

export default function UserButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowMenu((old) => !old);
        }}
      >
        {session?.user ? (
          <UserProfilePic />
        ) : (
          <div className="h-8 w-8">
            <UserCircle />
          </div>
        )}
      </button>
      {showMenu ? (
        <div className="absolute right-0 top-[100%] whitespace-nowrap rounded-md bg-[var(--color-neutral-1)] p-2">
          <p>Olá, {session?.user?.name || "Gamer"}!</p>
          <div className="border-b border-white"></div>
          {status === "authenticated" ? (
            <button className="secondary-button" onClick={() => void signOut()}>
              Sair
            </button>
          ) : (
            <button className="secondary-button" onClick={() => void signIn()}>
              Entrar
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

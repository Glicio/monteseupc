import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import MainLayout from "../../layouts/main";
import SideMenu, { SideMenuButton } from "../../components/navigation/sidemenu";
import { useState } from "react";

import UserComponent from "./user/usersDashboard";


const getActiveContent = (name: string) => {
  switch (name) {
    case "UserComponent":
      return <UserComponent />;
    default:
      return <></>;
  }
};

const Dashboard: NextPage = () => {
  const [activeComponent, setActiveContent] = useState("");

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <MainLayout>
        <div className="flex flex-grow bg-[var(--color-primary)] text-[var(--color-text-primary)]">
          <SideMenu>
            <SideMenuButton label="Solicitações" />
            <SideMenuButton label="Peças" />
            <SideMenuButton
              label="Usuários"
              onClick={() => {
                setActiveContent("UserComponent");
              }}
            />
          </SideMenu>
          <div className="content w-full">
            {getActiveContent(activeComponent)}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };

  if (!session.user?.isAdmin)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: {},
  };
};

export default Dashboard;

import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import MainLayout from "../../layouts/main";
import SideMenu, {
  SideMenuButton,
  SideMenuSection,
} from "../../components/navigation/sidemenu";
import { useState } from "react";

import UserComponent from "./user/usersDashboard";
import Sockets from "./parts/sockets";
import Chipsets from "./parts/chipsets";
import MotherBoard from "./parts/mobo";
import CPU from "./parts/cpu";
import Gpu from "./parts/gpu";


type ValidComponentType = "UserComponent" | "Sockets" | "Chipsets" | "MotherBoards" | "Processadores" | "GPU";

const getActiveContent = (name: ValidComponentType) => {
  switch (name) {
    case "UserComponent":
      return <UserComponent />;
    case "Sockets":
      return <Sockets />;
    case "Chipsets":
      return <Chipsets />;
    case "MotherBoards":
      return <MotherBoard />;
    case "Processadores":
      return <CPU/>;
    case "GPU": 
        return <Gpu/>;
    default:
      return <></>;
  }
};

const Dashboard: NextPage = () => {
  const [activeComponent, setActiveContent] = useState<ValidComponentType>("UserComponent");

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <MainLayout>
        <div className="flex flex-grow bg-[var(--color-primary)] text-[var(--color-text-primary)]">
          <SideMenu>
            <span className="font-bold">Painel Administrativo</span>
            <div className="w-full border-b border-[var(--color-text-primary)] my-3"></div>
            <SideMenuButton
              label="Usuários"
              onClick={() => {
                setActiveContent("UserComponent");
              }}
            />
            <SideMenuButton label="Solicitações de Cadastro" />
            <SideMenuSection label="Peças">
              <SideMenuButton
                label="Sockets"
                onClick={() => setActiveContent("Sockets")}
              />
              <SideMenuButton
                label="Chipsets"
                onClick={() => setActiveContent("Chipsets")}
              />
              <SideMenuButton label="Placas Mãe" onClick={() => setActiveContent("MotherBoards")}/>
              <SideMenuButton label="Processadores" onClick={() => setActiveContent("Processadores")}/>
              <SideMenuButton label="RAM" />
              <SideMenuButton label="GPU" onClick={() => setActiveContent("GPU")}/>
              <SideMenuButton label="PSU" />
              <SideMenuButton label="Gabinetes" />
              <SideMenuButton label="Armazenamento" />
              <SideMenuButton label="CPU Coolers" />
              <SideMenuButton label="FANs" />
              <SideMenuButton label="Monitores" />
              <SideMenuButton label="Teclados" />
              <SideMenuButton label="Mouses" />
            </SideMenuSection>
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

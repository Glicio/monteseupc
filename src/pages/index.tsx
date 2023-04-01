import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";


import MainLayout from "../layouts/main";

const Home: NextPage = () => {


  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Monte Seu PC!</title>
        <meta name="description" content="Monte Seu PC!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="items-center justify-center gap-4 bg-[var(--color-primary)] flex-grow p-2">
          <h1 className="text-6xl font-bold text-white">
            Welcome to <a href="https://nextjs.org">MonteSeuPC</a>
          </h1>
        </div>
      </MainLayout>
    </>
  );
};

export default Home;



import { type NextPage } from "next";
import Head from "next/head";

import MainLayout from "../layouts/main";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Monte Seu PC!</title>
        <meta name="description" content="Monte Seu PC!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="flex-grow items-center justify-center gap-4 bg-[var(--color-primary)] p-2">
          <h1 className="text-6xl font-bold text-white">
            Welcome to <a href="https://nextjs.org">MonteSeuPC</a>
          </h1>
        </div>
      </MainLayout>
    </>
  );
};

export default Home;

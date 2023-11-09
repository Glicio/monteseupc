import { type Part } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import GenericPartCard from "../components/parts/generic-part-card";
import MainLayout from "../layouts/main";
import { prisma } from "../server/db";

interface PageProps {
  lastAddedParts: string;
}

const Home: NextPage<PageProps> = ({ lastAddedParts }) => {
    const parsedParts = JSON.parse(lastAddedParts) as Part[];
  return (
    <>
      <Head>
        <title>Monte Seu PC!</title>
        <meta name="description" content="Monte Seu PC!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="items-center justify-center gap-4 bg-[var(--color-primary)] p-2">
          <h1 className="text-6xl font-bold text-white">Monte Seu PC!</h1>
        </div>
        {parsedParts.length > 0 && (
          <div className="bg-[var(--color-neutral-1)] p-4">
            <h1 className="text-2xl font-bold text-white">
              Últimas peças adicionadas
            </h1>
            <div className="scroll-thin overflow-x-scroll p-2">
              <div className="flex w-fit gap-2">
                {parsedParts.map((part) => (
                  <GenericPartCard key={part.id} part={part} />
                ))}
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const lastAddedParts = await prisma.part.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  return {
    props: {
            lastAddedParts: JSON.stringify(lastAddedParts),
    },
  };
};

export default Home;

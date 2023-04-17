import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import GenericPartCard from "../components/parts/generic-part-card";
import MainLayout from "../layouts/main";
import { getLastAddedParts } from "../server/db/parts/general";
import { type GenericPart } from "../types/parts";

interface PageProps {
    lastAddedParts: GenericPart[];
}

const Home: NextPage<PageProps> = ({ lastAddedParts }) => {
    return (
        <>
            <Head>
                <title>Monte Seu PC!</title>
                <meta name="description" content="Monte Seu PC!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout>
                <div className="items-center justify-center gap-4 bg-[var(--color-primary)] p-2">
                    <h1 className="text-6xl font-bold text-white">
                        Monte Seu PC!
                    </h1>
                </div>
                {lastAddedParts.length > 0 && (
                    <div className="bg-[var(--color-neutral-1)] p-4"
                    >
                        <h1 className="text-2xl font-bold text-white">
                            Últimas peças adicionadas
                        </h1>
                        <div className="overflow-x-scroll scroll-thin p-2">
                            <div className="flex gap-2 w-fit">
                            {lastAddedParts.map((part) => (
                                <GenericPartCard key={part.id} part={part} />
                            ))}</div>
                        </div>
                    </div>
                )}
            </MainLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    const lastAddedParts = await getLastAddedParts(true);
    return {
        props: {
            lastAddedParts,
        }
    }
};

export default Home;

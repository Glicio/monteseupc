import { type GetServerSideProps, type NextPage } from "next";
import { useEffect, useState } from "react";
import DefaultPagination from "../../components/navigation/defaultPagination";
import MainLayout from "../../layouts/main";
import { db, prisma } from "../../server/db";
import { api } from "../../utils/api";

interface Mobo {
    id: string;
    name: string;
    image?: string;
    createdAt: string;
    price: number;
    brand: string;
}

interface PageProps {
    mobos: Mobo[];
    numberOfPages: number;
}
const Mobo: NextPage<PageProps> = (props) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mobos, setMobos] = useState<Mobo[]>(props.mobos);
    const [pageChanged, setPageChanged] = useState(false);

    const mobosQuery = api.parts.motherBoards.getAll.useQuery(
        {
            take: 10,
            skip: (page - 1) * 10,
        },
        {
            enabled: false,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setTotalPages(data.pages);
                const newMobos: Mobo[] = [];
                if (!data.motherboards) return;
                console.log("Fetched");
                for (let i = 0; i < data.motherboards.length; i++) {
                    newMobos.push({
                        id: data.motherboards[i]?.id as string,
                        name: data.motherboards[i]?.name || "",
                        image: data.motherboards[i]?.image || "",
                        createdAt:
                            data.motherboards[i]?.createdAt.toLocaleDateString(
                                "pt-br"
                            ) || "",
                        price: data.motherboards[i]?.price || 0,
                        brand: data.motherboards[i]?.brand || "",
                    });
                }
            },
        }
    );
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    useEffect(() => {
        if (!pageChanged) return;
        void mobosQuery.refetch();
    }, [page, pageChanged]);

    return (
        <MainLayout>
            <div className="flex">
                <div className="filters w-[10rem] h-fit p-2 bg-[var(--color-neutral-1)]">
                    <h2 className="mx-auto p-1">Filtros</h2>
                    <div className="flex gap-2">
                    <input type="checkbox" />
                        <label htmlFor="brand">Verificado</label>
                    </div>

                </div>
                <div className="p-4">
                    {mobos?.map((mobo) => (
                        <div key={mobo.id} className="flex w-full ">
                            <div className="h-[8rem] w-[8rem] overflow-hidden">
                                {mobo.image ? (
                                    <img
                                        src={mobo.image}
                                        alt="Motherboard Image"
                                        style={{ height: "8rem" }}
                                    />
                                ) : (
                                    <span>TO ADD PLACEHOLD IMAGE</span>
                                )}
                            </div>

                            <div>
                                <div className="text-lg font-bold">
                                    {mobo.name}
                                </div>
                                <div className="text-xs">
                                    Marca: {mobo.brand}
                                </div>
                                <div className="text-xs">
                                    Preço base:{" "}
                                    {formatter.format(mobo.price / 100)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <DefaultPagination
                        page={page}
                        totalPages={totalPages}
                        setPage={(value) => {
                            setPage(value);
                            setPageChanged(true);
                        }}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    const mobos: Mobo[] = [];
    const mobosCount = await prisma.motherBoard.count({
        where: {
            approved: true,
        },
    });
    try{
    const parts = await db.execute("SELECT id, name, brand FROM MotherBoard UNION SELECT id, name, brand FROM CPU");
        console.log("lista", parts);
    }catch(err){
        console.log("erro", err);
    }
    const mobosQuery = await prisma.motherBoard.findMany({
        where: {},
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
        select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            price: true,
            brand: true,
        },
    });

    for (let i = 0; i < mobosQuery.length; i++) {
        mobos.push({
            id: mobosQuery[i]?.id as string,
            name: mobosQuery[i]?.name || "",
            image: mobosQuery[i]?.image || undefined,
            createdAt:
                mobosQuery[i]?.createdAt.toLocaleDateString("pt-br") || "",
            price: mobosQuery[i]?.price || 0,
            brand: mobosQuery[i]?.brand || "",
        });
    }

    return {
        props: {
            mobos: mobos,
            numberOfPages: Math.ceil(mobosCount / 10),
        },
    };
};

export default Mobo;

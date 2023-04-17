import React from "react";
import MainLayout from "../../../layouts/main";
import { type GetServerSideProps, type NextPage } from "next";
import {
    getMotherboardById,
    type MotherBoard,
} from "../../../server/db/parts/motherboard";
import formatNumberToBRL from "../../../utils/formatNumberToBRL";
import dateIsoStringToString from "../../../utils/dateIsoStringToString";

//next can't serialize the date object, so we need to convert it to a string
type SerializableMobo = Omit<
    MotherBoard,
    "createdAt" | "updatedAt" | "approvedAt"
> & { createdAt: string };

interface PageProps {
    moboData: SerializableMobo;
}

const MoboDisplay: NextPage<PageProps> = ({ moboData }) => {
    return (
        <MainLayout>
            <div className="mx-auto">
                <div className="mx-auto h-[20rem]">
                    {moboData.image ? (
                        <img
                            src={moboData.image}
                            alt="Motherboard Image"
                            className="h-full"
                        />
                    ) : (
                        <span>TO ADD PLACEHOLD IMAGE</span>
                    )}
                </div>

                <h1 className="text-4xl font-bold">
                    {moboData.brand} {moboData.name}
                </h1>
                <div className="info flex gap-4">
                    <span className="text-xs">
                        Cadastrado por {moboData.createdByName} em{" "}
                        {dateIsoStringToString(moboData.createdAt)}
                    </span>
                </div>
                <div className="info flex gap-4">
                    <span className="">
                        Valor Médio: {formatNumberToBRL(moboData.price)}
                    </span>
                </div>
            </div>
        </MainLayout>
    );
};

export default MoboDisplay;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
    ctx
) => {
    if (!ctx.params || !ctx?.params?.id) {
        return {
            notFound: true,
        };
    }

    const mobo = await getMotherboardById(ctx.params.id as string);
    return {
        props: {
            //next can't serialize the date object, so we need to convert it to a string
            moboData: JSON.parse(JSON.stringify(mobo)) as SerializableMobo,
        },
    };
};

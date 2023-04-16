import { GraphicsCard } from "@prisma/client";
import React from "react";
import DefaultTextInput from "../../../components/input/defaultTextInput";

interface UserInfo {
    id: string;
    name: string;
}

interface FormGraphicsCard
    extends Omit<
        GraphicsCard,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "approvedAt"
        | "approved"
        | "createdById"
        | "updatedById"
        | "approvedById"
    > {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    approvedAt?: Date;
    createdBy?: UserInfo;
    updatedBy?: UserInfo;
    approvedBy?: UserInfo;
    approved?: boolean;
}

type GpuAction = keyof FormGraphicsCard;

const gpuReducer = (
    state: FormGraphicsCard,
    action: {
        type: GpuAction;
        payload: string | undefined | Date | number | boolean;
    }
): FormGraphicsCard => {
    return { ...state, [action.type]: action.payload };
};

const gpuInitialState: FormGraphicsCard = {
    name: "",
    price: 0,
    brand: "",
    image: "",
    link: "",
    clock: 0,
    memory: 0,
    memoryType: "",
    memoryClock: 0,
    recommendedPsu: 0,
    tdp: 0,
    pciGen: "",
    displayPort: 0,
    hdmi: 0,
    dvi: 0,
    vga: 0,
    obs: "",
};

const GpuForm = ({ gpuToEdit }: { gpuToEdit?: FormGraphicsCard }) => {
    const [gpu, dispatcher] = React.useReducer(
        gpuReducer,
        gpuToEdit || gpuInitialState
    );

    return (
        <div className="p-2">
            <form
                className="mx-auto flex w-[25rem] flex-col gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">
                        {gpuToEdit ? "Editar" : "Cadastrar"} Placa Mãe
                    </h1>
                    {gpuToEdit?.id && (
                        <span className="text-sm text-[var(--color-neutral-2)]">
                            ID: {gpuToEdit?.id}
                        </span>
                    )}
                    {gpuToEdit?.createdAt && (
                        <span className="text-sm text-[var(--color-neutral-2)]">
                            Criado em:{" "}
                            {gpuToEdit?.createdAt.toLocaleDateString()}
                            {gpuToEdit?.createdBy && (
                                <span>
                                    {" "}
                                    por {gpuToEdit?.createdBy.name || "N/I"}
                                </span>
                            )}
                        </span>
                    )}
                    {gpuToEdit?.updatedAt && (
                        <span className="text-sm text-[var(--color-neutral-2)]">
                            Ultima atualização em:{" "}
                            {gpuToEdit?.updatedAt.toLocaleDateString()}
                            {gpuToEdit?.updatedBy && (
                                <span>
                                    {" "}
                                    por {gpuToEdit?.updatedBy.name || "N/I"}
                                </span>
                            )}
                        </span>
                    )}
                </div>
                {gpuToEdit && (
                    <button
                        type="button"
                        className="primary-button w-[8rem]"
                        onClick={() => console.log("DELETAR")}
                    >
                        Deletar
                    </button>
                )}
                <DefaultTextInput
                    title="Nome"
                    value={gpuToEdit?.name || gpu.name}
                    setValue={(value: string) =>
                        dispatcher({ type: "name", payload: value })
                    }
                />

                <button type="submit" className="primary-button">
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default function Gpu() {
    const [createMode, setCreateMode] = React.useState(false);

    if (createMode) {
        return <GpuForm />;
    }

    return (
        <div className="p-2">
            <div className="header">
                <h1 className="text-2xl">Placas de Vídeo</h1>
                <span className="text-sm text-[var(--color-neutral-2)]">
                    Carregando...
                </span>
            </div>
            <button
                className="primary-button"
                onClick={() => setCreateMode(true)}
            >
                Incluir
            </button>
            <table className="default-table mt-2">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Marca</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}

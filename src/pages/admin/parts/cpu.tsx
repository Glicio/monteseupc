import { User, type CPU } from "@prisma/client";
import React from "react";
import DefaultTextInput from "../../../components/input/defaultTextInput";
import BackButton from "../../../components/navigation/backButton";
import SelectSocket from "../../../components/input/selectSocket";
import DefaultNumberInput from "../../../components/input/defaultNumberInput";
import CurrencyInput from "../../../components/input/currencyInput";
import { api } from "../../../utils/api";
import { AppContext } from "../../../components/context/AppContext";
import TableSearchForm from "../../../components/input/tableSearchForm";
import ConfirmDialog from "../../../components/input/confirmDialog";

interface CPUFormState
    extends Omit<
        CPU,
        "id" | "createdAt" | "createdById" | "updatedById" | "updatedAt" | "approved" | "approvedById" | "approvedAt" | "approvedById"
    > {
    id: string | null;
    createdAt?: Date | null,
    createdBy?: User | null,
    updatedAt?: Date | null,
    updatedBy?: User | null,
    approved?: boolean | null,
    approvedAt?: Date | null,
    approvedBy?: User | null,

}

type CPUReducerAction = keyof CPUFormState | "reset";

const cpuFormReducer = (
    state: CPUFormState,
    action: {
        type: CPUReducerAction;
        payload: string | number | null | undefined | boolean;
    }
): CPUFormState => {
    return { ...state, [action.type]: action.payload };
};

const CPUFormInitialState: CPUFormState = {
    id: null,
    name: "",
    socketId: "",
    brand: "",
    cores: 0,
    threads: 0,
    baseClock: 0,
    boostClock: 0,
    tdp: 0,
    integratedGpu: false,
    price: 0,
    cache1: 0,
    cache2: 0,
    cache3: 0,
    launchDate: "Q1:21",
    generation: 0,
    image: "",
    link: "",
    obs: "",
};

const CPUForm = ({
    cpuToEdit,
    back,
}: {
    cpuToEdit: CPUFormState | null;
    back: () => void;
}) => {
    const [cpu, cpuDispatcher] = React.useReducer(
        cpuFormReducer,
        cpuToEdit ?? CPUFormInitialState
    );
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const { toast } = React.useContext(AppContext);

    const createMutation = api.parts.cpu.admin.create.useMutation({
        onSuccess: () => {
            toast.success("Processador cadastrado com sucesso!");
            back();
        },
        onError: (err) => {
            toast.error("Erro ao cadastrar processador!");
            console.error(err);
        },
    });
    const updateMutation = api.parts.cpu.admin.update.useMutation({
        onSuccess: () => {
            toast.success("Atualizado com sucesso!");
            back();
        },
        onError: (err) => {
            console.error(err);
            toast.error("Erro ao atualizar");
        },
    });

    const deleteMutation = api.parts.cpu.admin.delete.useMutation({
        onSuccess: () => {
            toast.success("Deletado com sucesso!");
            back();
        },
        onError: (err) => {
            console.error(err);
            toast.error("Erro ao excluir processador");
        },
    });

    return (
        <div className="p-2">
            <BackButton onClick={() => back()} />
            <ConfirmDialog
                onConfirm={() => {
                    if (!cpuToEdit?.id) return;
                    deleteMutation.mutate({ id: cpuToEdit?.id });
                }}
                open={confirmDelete}
                onClose={() => {
                    setConfirmDelete(false);
                }}
                title="Deletar Processador?"
                confirmText={cpuToEdit?.name || "CPU"}
            />

            <div className="mx-auto w-[25rem]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (cpuToEdit && cpuToEdit.id) {
                            return updateMutation.mutate({
                                data: {
                                    ...cpu,
                                    id: cpuToEdit.id,
                                    obs: cpu.obs || undefined,
                                },
                            });
                        }
                        return createMutation.mutate({
                            data: {
                                ...cpu,
                                obs: cpu.obs || undefined,
                            },
                        });
                    }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-2xl font-bold">
                        {cpuToEdit ? "Editar" : "Cadastrar"} Processador
                    </h1>

          {cpuToEdit?.id && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              ID: {cpuToEdit.id} {" "} Aprovado: {cpuToEdit.approved ? "Sim" : "Não"}
            </span>
          )}
          {cpuToEdit?.createdAt && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              Criado em: {cpuToEdit.createdAt.toLocaleDateString()}
              {cpuToEdit?.createdBy && (
                <span> por {cpuToEdit.createdBy.name || "N/I"}</span>
              )}
            </span>
          )}
          {cpuToEdit?.updatedAt && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              Ultima atualização em: {cpuToEdit.updatedAt.toLocaleDateString()}
              {cpuToEdit?.updatedBy && (
                <span> por {cpuToEdit.updatedBy.name || "N/I"}</span>
              )}
            </span>
          )}
                    {cpuToEdit && (
                        <button
                            type="button"
                            className="primary-button w-[10rem]"
                            onClick={() => {
                                setConfirmDelete(true);
                            }}
                        >
                            Deletar
                        </button>
                    )}
                    <DefaultTextInput
                        value={cpu.name}
                        placeholder="Ex: i7-9700K"
                        required
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "name",
                                payload: value,
                            });
                        }}
                        title={"Modelo"}
                    />
                    <SelectSocket
                        value={cpu.socketId}
                        required
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "socketId",
                                payload: value,
                            });
                        }}
                    />
                    {/* Imagem */}
                    <DefaultTextInput
                        value={cpu.image}
                        required
                        placeholder="Ex: https://i.imgur.com/..."
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "image",
                                payload: value,
                            });
                        }}
                        title={"Imagem"}
                    />
                    {/* Link */}
                    <DefaultTextInput
                        value={cpu.link || ""}
                        required
                        placeholder="Ex: https://www.intel.com.br/content/..."
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "link",
                                payload: value,
                            });
                        }}
                        title={"Link"}
                    />
                    <DefaultTextInput
                        value={cpu.brand}
                        placeholder="Ex: Intel"
                        required
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "brand",
                                payload: value,
                            });
                        }}
                        title={"Marca"}
                    />
                    {/* Núcleos e threads */}
                    <div className="flex gap-2">
                        <DefaultNumberInput
                            value={cpu.cores}
                            placeholder="Ex: 8"
                            required
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "cores",
                                    payload: value,
                                });
                            }}
                            title={"Núcleos"}
                        />
                        <DefaultNumberInput
                            value={cpu.threads}
                            placeholder="Ex: 8"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "threads",
                                    payload: value,
                                });
                            }}
                            title={"Threads"}
                        />
                    </div>

                    {/* Clocks */}
                    <div className="flex gap-2">
                        <DefaultNumberInput
                            value={cpu.baseClock}
                            placeholder="Ex: 3600"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "baseClock",
                                    payload: value,
                                });
                            }}
                            title={"Clock Base (MHz)"}
                        />
                        <DefaultNumberInput
                            value={cpu.boostClock}
                            placeholder="Ex: 5000"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "boostClock",
                                    payload: value,
                                });
                            }}
                            title={"Clock Boost (MHz)"}
                        />
                    </div>

                    {/* Cache */}
                    <div className="flex gap-2">
                        <DefaultNumberInput
                            value={cpu.cache1}
                            placeholder="Ex: 8"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "cache1",
                                    payload: value,
                                });
                            }}
                            title={"Cache L1 (MB)"}
                        />
                        <DefaultNumberInput
                            value={cpu.cache2}
                            placeholder="Ex: 8"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "cache2",
                                    payload: value,
                                });
                            }}
                            title={"Cache L2 (MB)"}
                        />
                        <DefaultNumberInput
                            value={cpu.cache3}
                            placeholder="Ex: 8"
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "cache3",
                                    payload: value,
                                });
                            }}
                            title={"Cache L3 (MB)"}
                        />
                    </div>

                    {/* TDP */}
                    <DefaultNumberInput
                        value={cpu.tdp}
                        placeholder="Ex: 125"
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "tdp",
                                payload: value,
                            });
                        }}
                        title={"TDP (W)"}
                    />

                    {/* Geração */}
                    <DefaultNumberInput
                        value={cpu.generation}
                        placeholder="Ex: 10"
                        setValue={(value) => {
                            return cpuDispatcher({
                                type: "generation",
                                payload: value,
                            });
                        }}
                        title={"Geração"}
                    />

                    {/* Preço */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold">Preço</label>
                        <CurrencyInput
                            value={cpu.price}
                            setValue={(value) => {
                                return cpuDispatcher({
                                    type: "price",
                                    payload: value,
                                });
                            }}
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-sm font-bold">Descrição</label>
                        <textarea
                            className="w-full rounded-md border border-[var(--color-neutral-2)] bg-transparent p-2"
                            value={cpu.obs || ""}
                            onChange={(e) => {
                                return cpuDispatcher({
                                    type: "obs",
                                    payload: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <button className="primary-button" type="submit">
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function CPU() {
    const [createMode, setCreateMode] = React.useState(false);
    const [currentCPU, setCurrentCPU] = React.useState<CPU | null>(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(1);

    const back = () => {
        setCreateMode(false);
        setCurrentCPU(null);
        void cpus.refetch();
    };

    const cpus = api.parts.cpu.getAll.useQuery(
        {
            searchTerm,
        },
        {
            refetchOnWindowFocus: false,
        }
    );
    if (createMode || currentCPU) {
        return <CPUForm cpuToEdit={currentCPU} back={() => back()} />;
    }
    return (
        <div className="p-2">
            <div className="header">
                <h1 className="text-2xl">Processadores</h1>
                <span className="text-sm text-[var(--color-neutral-2)]">
                    {cpus.data?.count
                        ? `${cpus.data.count} processadores encontrados`
                        : "Carregando..."}
                </span>
            </div>
            <button
                className="primary-button"
                onClick={() => setCreateMode(true)}
            >
                Incluir
            </button>
            <table className="default-table mt-4">
                <thead>
                    <tr>
                        <td colSpan={3}>
                            <TableSearchForm
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                page={page}
                                setPage={(value) => setPage(value)}
                                numberOfPages={cpus.data?.count || 0}
                                refresh={() => void cpus.refetch()}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Modelo</th>
                        <th>Socket</th>
                        <th>Marca</th>
                    </tr>
                </thead>
                <tbody>
                    {cpus.isLoading ? (
                        <tr>
                            <td colSpan={3}>Carregando...</td>
                        </tr>
                    ) : null}
                    {cpus.isError ? (
                        <tr>
                            <td colSpan={3}>Erro ao carregar</td>
                        </tr>
                    ) : null}
                    {cpus.data?.cpus?.map((cpu) => {
                        return (
                            <tr key={cpu.id}>
                                <td>
                                    <button
                                        onClick={() => {
                                            setCurrentCPU(cpu);
                                        }}
                                        className={"secondary-button"}
                                    >
                                        {cpu.name}
                                    </button>
                                </td>
                                <td>{cpu.socket.name}</td>
                                <td>{cpu.brand}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

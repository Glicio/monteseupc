import React from "react";
import MainLayout from "../../../layouts/main";
import { type CreateGpuInput } from "../../../server/db/parts/graphics-card";
import { api } from "../../../utils/api";
import { AppContext } from "../../context/AppContext";
import CurrencyInput from "../../input/currencyInput";
import DefaultNumberInput from "../../input/defaultNumberInput";
import DefaultTextInput from "../../input/defaultTextInput";
import DefaultForm from "./default-form";

type ReducerActions = keyof CreateGpuInput;

const reducer = (
    state: CreateGpuInput,
    action: {
        type: ReducerActions;
        payload: string | boolean | number | undefined;
    }
) => {
    return { ...state, [action.type]: action.payload };
};

const initialState: CreateGpuInput = {
    name: "",
    brand: "",
    price: 0,
    memory: 0,
    memoryType: "GDDR5",
    memoryClock: 0,
    dvi: 0,
    hdmi: 0,
    displayPort: 0,
    vga: 0,
    tdp: 0,
    link: "",
    image: "",
    obs: "",
    clock: 0,
    pciGen: "3",
    recommendedPsu: 0,
};

type Dispatcher = React.Dispatch<{
    type: ReducerActions;
    payload: string | boolean | number | undefined;
}>;

type StepProps = {
    state: CreateGpuInput;
    dispatch: Dispatcher;
};

const ObsAndSave = ({
    state,
    dispatch,
    prev,
}: StepProps & { prev: () => void }) => {
    const { toast } = React.useContext(AppContext);
    const saveMutation = api.parts.gpu.create.useMutation({
        onSuccess: () => {
            toast.success("Placa de vídeo criada com sucesso");
        },
        onError: () => {
            toast.error("Erro ao criar placa de vídeo");
        },
    });
    return (
        <DefaultForm
            title=""
            onSubmit={() => {
                void saveMutation.mutate({
                    ...state
                })
            }}
        >
            <div className="form-item">
                <label htmlFor="obs">Informações adicionais</label>
                <textarea
                    id=""
                    name=""
                    cols={30}
                    rows={3}
                    placeholder="Ex: Incompatível com placa mãe da marca X"
                    className="default-text-input border p-1"
                    onChange={(e) => {
                        if (e.target.value.length > 200) return;
                        dispatch({ type: "obs", payload: e.target.value });
                    }}
                    value={state.obs}
                />
            </div>
            <div className="mt-4 flex justify-center gap-2">
                <button
                    className="secondary-button"
                    type="button"
                    onClick={prev}
                >
                    voltar
                </button>
                <button type="submit" className="primary-button">
                    Salvar
                </button>
            </div>
        </DefaultForm>
    );
};
const Ports = ({
    state,
    dispatch,
    next,
    prev,
}: StepProps & { next: () => void; prev: () => void }) => {
    return (
        <DefaultForm
            title="Saídas de Vídeo"
            onSubmit={() => {
                next;
            }}
        >
            <DefaultNumberInput
                title="DVI"
                value={state.dvi}
                setValue={(value) => dispatch({ type: "dvi", payload: value })}
            />
            <DefaultNumberInput
                title="HDMI"
                value={state.hdmi}
                setValue={(value) => dispatch({ type: "hdmi", payload: value })}
            />
            <DefaultNumberInput
                title="DisplayPort"
                value={state.displayPort}
                setValue={(value) =>
                    dispatch({ type: "displayPort", payload: value })
                }
            />
            <DefaultNumberInput
                title="VGA"
                value={state.vga}
                setValue={(value) => dispatch({ type: "vga", payload: value })}
            />
            <div className="mt-4 flex justify-center gap-2">
                <button
                    className="secondary-button"
                    type="button"
                    onClick={prev}
                >
                    voltar
                </button>
                <button type="submit" onClick={next} className="primary-button">
                    Próximo
                </button>
            </div>
        </DefaultForm>
    );
};

const PowerInfo = ({
    next,
    prev,
    state,
    dispatch,
}: StepProps & { next: () => void; prev: () => void }) => {
    return (
        <DefaultForm title="Informações de energia" onSubmit={next}>
            <DefaultNumberInput
                title="TDP (Watts)"
                value={state.tdp}
                setValue={(value) => dispatch({ type: "tdp", payload: value })}
            />
            <DefaultNumberInput
                title="Potência recomendado para fontes(Watts)"
                value={state.recommendedPsu}
                setValue={(value) =>
                    dispatch({ type: "recommendedPsu", payload: value })
                }
            />
            <div className="mt-4 flex justify-center gap-2">
                <button
                    className="secondary-button"
                    type="button"
                    onClick={prev}
                >
                    voltar
                </button>
                <button type="submit" className="primary-button">
                    Próximo
                </button>
            </div>
        </DefaultForm>
    );
};

const MemoryInfo = ({
    next,
    prev,
    state,
    dispatch,
}: StepProps & { next: () => void; prev: () => void }) => {
    return (
        <DefaultForm title="Informações de memória" onSubmit={next}>
            <DefaultNumberInput
                title="Memória (GB)"
                value={state.memory}
                setValue={(value) =>
                    dispatch({ type: "memory", payload: value })
                }
            />
            <DefaultNumberInput
                title="Clock (MHz)"
                value={state.memoryClock}
                setValue={(value) =>
                    dispatch({ type: "memoryClock", payload: value })
                }
            />
            <div className="form-item">
                <label htmlFor="memory type">Tipo da memória</label>
                <select
                    name="memory type"
                    id="memory type"
                    className="default-select-input"
                    value={state.memoryType}
                    onChange={(e) =>
                        dispatch({
                            type: "memoryType",
                            payload: e.target.value,
                        })
                    }
                >
                    <option value="HBM2">HBM2</option>
                    <option value="HBM3">HBM3</option>
                    <option value="HBM4">HBM4</option>
                    <option value="GDDR5">GDDR5</option>
                    <option value="GDDR6">GDDR6</option>
                    <option value="GDDR6X">GDDR6X</option>
                    <option value="GDDR7">GDDR7</option>
                </select>
            </div>
            <div className="mt-4 flex justify-center gap-2">
                <button
                    className="secondary-button"
                    type="button"
                    onClick={prev}
                >
                    voltar
                </button>
                <button type="submit" className="primary-button">
                    Próximo
                </button>
            </div>
        </DefaultForm>
    );
};

const GeneralInfo = ({
    next,
    state,
    dispatch,
}: StepProps & { next: () => void }) => {
    return (
        <DefaultForm
            title="Informações gerais"
            onSubmit={() => {
                next();
            }}
        >
            <DefaultTextInput
                title="Modelo"
                placeholder="Ex: GTX 1080"
                value={state.name}
                required={true}
                setValue={(value) => dispatch({ type: "name", payload: value })}
            />
            <DefaultTextInput
                title="Marca"
                placeholder="Ex: Gigabyte"
                value={state.brand}
                required={true}
                setValue={(value) =>
                    dispatch({ type: "brand", payload: value })
                }
            />
            <DefaultTextInput
                title="Link"
                placeholder="Ex: https://www.amazon.com.br"
                value={state.link}
                required={true}
                setValue={(value) => dispatch({ type: "link", payload: value })}
            />
            <DefaultTextInput
                title="URL da Imagem"
                placeholder="Ex: https://i.imgur.com/OBB7tLg.gif"
                value={state.image}
                required={true}
                setValue={(value) =>
                    dispatch({ type: "image", payload: value })
                }
            />

            <div className="form-item ">
                <label htmlFor="price">Preço médio</label>
                <CurrencyInput
                    value={state.price}
                    setValue={(value) =>
                        dispatch({ type: "price", payload: value })
                    }
                />
            </div>
            <div className="form-item">
                <label htmlFor="pcigen">Generação PCIe</label>
                <select
                    name="pcigen"
                    id="pcigen"
                    className="default-select-input"
                    value={state.pciGen}
                    onChange={(e) =>
                        dispatch({ type: "pciGen", payload: e.target.value })
                    }
                >
                    <option value="1">PCIe 1.0</option>
                    <option value="2">PCIe 2.0</option>
                    <option value="3">PCIe 3.0</option>
                    <option value="4">PCIe 4.0</option>
                </select>
            </div>
            <div className=" mt-4  flex justify-center">
                <button className="primary-button " type="submit">
                    Próximo
                </button>
            </div>
        </DefaultForm>
    );
};

const GetCurrentStep = ({
    step,
    setStep,
    state,
    dispatch,
}: {
    step: number;
    setStep: (v: number) => void;
    state: CreateGpuInput;
    dispatch: Dispatcher;
}) => {
    switch (step) {
        case 4:
            return (
                <ObsAndSave
                    state={state}
                    dispatch={dispatch}
                    prev={() => setStep(3)}
                />
            );
        case 3:
            return (
                <Ports
                    state={state}
                    dispatch={dispatch}
                    next={() => setStep(4)}
                    prev={() => setStep(2)}
                />
            );

        case 2:
            return (
                <PowerInfo
                    state={state}
                    dispatch={dispatch}
                    next={() => setStep(3)}
                    prev={() => setStep(1)}
                />
            );

        case 1:
            return (
                <MemoryInfo
                    state={state}
                    dispatch={dispatch}
                    next={() => setStep(2)}
                    prev={() => setStep(0)}
                />
            );
        default:
            return (
                <GeneralInfo
                    state={state}
                    dispatch={dispatch}
                    next={() => setStep(1)}
                />
            );
    }
};

export default function CreateGpuForm() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [step, setStep] = React.useState(0);
    return (
        <MainLayout>
            <main className="flex flex-grow  flex-col items-center p-4">
                <h1 className="text-4xl font-bold">
                    Cadastrar nova placa de vídeo
                </h1>
                <GetCurrentStep
                    step={step}
                    setStep={setStep}
                    state={state}
                    dispatch={dispatch}
                />
            </main>
        </MainLayout>
    );
}

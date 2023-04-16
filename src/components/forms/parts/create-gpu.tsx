import React from "react";
import MainLayout from "../../../layouts/main";
import { CreateGpuInput } from "../../../server/db/parts/graphics-card";
import CurrencyInput from "../../input/currencyInput";
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
    memoryType: "",
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
    pciGen: "",
    recommendedPsu: 0,
};

type Dispatcher = React.Dispatch<{
    type: ReducerActions;
    payload: string | boolean | number | undefined;
}>;

const GeneralInfo = ({
    next,
    state,
    dispatch,
}: {
    next: () => void;
    state: CreateGpuInput;
    dispatch: Dispatcher;
}) => {
    return (
        <DefaultForm title="Informações gerais" onSubmit={next}>
            <DefaultTextInput
                title="Nome"
                value={state.name}
                setValue={(value) => dispatch({ type: "name", payload: value })}
            />
            <DefaultTextInput
                title="Marca"
                value={state.brand}
                setValue={(value) =>
                    dispatch({ type: "brand", payload: value })
                }
            />
            <div className="form-item ">
                <label htmlFor="price">Preço</label>
                <CurrencyInput
                    value={state.price}
                    setValue={(value) =>
                        dispatch({ type: "price", payload: value })
                    }
                />
            </div>
                <div className=" flex  justify-center mt-4">
                    <button className="primary-button " type="submit">Próximo</button>
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

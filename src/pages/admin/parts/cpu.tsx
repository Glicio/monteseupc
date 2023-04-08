import { type CPU } from "@prisma/client";
import React from "react";
import DefaultTextInput from "../../../components/input/defaultTextInput";
import BackButton from "../../../components/navigation/backButton";
import SelectSocket from "../../../components/input/selectSocket";
import DefaultNumberInput from "../../../components/input/defaultNumberInput";
import CurrencyInput from "../../../components/input/currencyInput";

interface CPUFormState
  extends Omit<CPU, "id" | "createdAt" | "createdById" | "updatedById"> {
  id: string | null;
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
  chipsetId: "",
  generation: 0,
  image: "",
  link: "",
  obs: "",
};

const CPUForm = ({
  cpuToEdit,
  back,
}: {
  cpuToEdit: CPU | null;
  back: () => void;
}) => {
  const [cpu, cpuDispatcher] = React.useReducer(
    cpuFormReducer,
    cpuToEdit ?? CPUFormInitialState
  );

  return (
    <div className="p-2">
      <BackButton onClick={() => back()} />
      <div className="mx-auto w-[25rem]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold">
            {cpuToEdit ? "Editar" : "Cadastrar"} Processador
          </h1>

          <DefaultTextInput
            value={cpu.name}
            placeholder="Ex: i7-9700K"
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
                    className="w-full border border-[var(--color-neutral-2)] bg-transparent rounded-md p-2"
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

  const back = () => {
    setCreateMode(false);
    setCurrentCPU(null);
  };

  if (createMode) {
    return <CPUForm cpuToEdit={currentCPU} back={() => back()} />;
  }
  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Processadores</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          {"Carregando..."}
        </span>
      </div>
      <button className="primary-button" onClick={() => setCreateMode(true)}>
        Incluir
      </button>
      <table className="default-table mt-4">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Socket</th>
            <th>Marca</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

import React, { useContext } from "react";
import BackButton from "../../../components/navigation/backButton";
import { api } from "../../../utils/api";
import { type MotherBoard } from "@prisma/client";
import CurrencyInput from "../../../components/input/currencyInput";
import DefaultTextInput from "../../../components/input/defaultTextInput";
import DefaultNumberInput from "../../../components/input/defaultNumberInput";
import SelectRamType from "../../../components/input/selectRam";
import SelectChipset from "../../../components/input/selectChipset";
import SelectSocket from "../../../components/input/selectSocket";
import { AppContext } from "../../../components/context/AppContext";
import TableSearchForm from "../../../components/input/tableSearchForm";

type MoboActions = keyof MotherBoard;

const motherBoardInitialState: MotherBoard = {
  id: "",
  name: "",
  socketId: "",
  brand: "",
  price: 0,
  image: "",
  link: "",
  ramSlots: 0,
  ramType: "DDR4",
  ramMaxSize: 4,
  ramMaxSpeed: 3200,
  ramChannels: 2,
  ramEcc: false,
  usb2: 0,
  usb3: 0,
  usb3_1: 0,
  usb3_2: 0,
  usbTypeC: 0,
  sata: 1,
  m2: 0,
  pcieX16: 1,
  pciGen: "",
  size: "ATX",
  chipsetId: "",
  createdAt: new Date(),
  launchDate: null,
  obs: "",
};

const moboReducer = (
  state: MotherBoard,
  action: { type: MoboActions; payload: string | number | boolean | undefined | null | Date }
): MotherBoard => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const MotherBoarForm = ({
  back,
  moboToEdit,
}: {
  back: () => void;
  moboToEdit?: MotherBoard;
}) => {
  
  const {toast} = useContext(AppContext)

  const createOrUpdate = api.parts.motherBoards.admin.createOrUpdate.useMutation({
    onSuccess: () => {
      toast.success("Placa mãe salva com sucesso!")
      back();
    },
    onError: (err) => {
      toast.error("Erro ao salvar placa mãe!")
      console.error(err)
    }
  })

  const [mobo, dispatch] = React.useReducer(
    moboReducer,
    moboToEdit || motherBoardInitialState
  );

  return (
    <div className="w-full p-2 pb-4">
      <BackButton onClick={back} />
      <form
        className="mx-auto flex w-[25rem] flex-col gap-2"
        onSubmit={(e) => {
          const { id, ...data } = mobo;

          createOrUpdate.mutate({ id, data });

          e.preventDefault();
        }}
      >
        <DefaultTextInput
          required
          title="Nome"
          value={mobo.name}
          placeholder="Z390 Aorus Pro"
          setValue={(value) => dispatch({ type: "name", payload: value })}
        />
        <DefaultTextInput
          required
          title="Marca"
          value={mobo.brand}
          placeholder="Aorus"
          setValue={(value) => dispatch({ type: "brand", payload: value })}
        />
        <SelectSocket
          value={mobo.socketId}
          required
          setValue={(value) => dispatch({ type: "socketId", payload: value })}
        />
        <SelectChipset
          required
          value={mobo.chipsetId}
          socketId={mobo.socketId}
          setValue={(value) => {
            dispatch({ type: "chipsetId", payload: value });
          }}
        />
        <div className="form-item flex flex-col">
          <label htmlFor="price">Preço Base</label>
          <CurrencyInput
            value={mobo.price}
            setValue={(value) => {
              dispatch({ type: "price", payload: value });
            }}
          />
        </div>
        <DefaultTextInput
          title="Imagem"
          required
          value={mobo.image || ""}
          placeholder="https://..."
          setValue={(value) => dispatch({ type: "image", payload: value })}
        />
        <DefaultTextInput
          title="Link Oficial"
          required
          value={mobo.link || ""}
          placeholder="https://..."
          setValue={(value) => dispatch({ type: "link", payload: value })}
        />

        <div className="ram flex items-end gap-2">
          <DefaultNumberInput
            title="Slots de Memória RAM"
            value={mobo.ramSlots}
            placeholder="4"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "ramSlots", payload: value });
            }}
          />
          <SelectRamType
            value={mobo.ramType}
            setValue={(value) => dispatch({ type: "ramType", payload: value })}
          />
        </div>
        <DefaultNumberInput
          title="Tamanho Máximo de Memória RAM (GB)"
          value={mobo.ramMaxSize}
          placeholder="4"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "ramMaxSize", payload: value });
          }}
        />
        <DefaultNumberInput
          title="Velocidade Máxima de Memória RAM (MHz)"
          value={mobo.ramMaxSpeed}
          placeholder="3200"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "ramMaxSpeed", payload: value });
          }}
        />
        <DefaultNumberInput
          title="Canais de Memória RAM"
          value={mobo.ramChannels}
          placeholder="2"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "ramChannels", payload: value });
          }}
        />

        <div className="form-item flex flex-col">
          <label htmlFor="ramEcc">Suporta ECC</label>
          <select
            name="ecc"
            id="ecc"
            className="default-select-input"
            onChange={(e) => {
              dispatch({ type: "ramEcc", payload: e.target.value === "true" });
            }}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
        <div className="usb grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas USB 2.0"
            value={mobo.usb2}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "usb2", payload: value });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.0"
            value={mobo.usb3}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "usb3", payload: value });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.1"
            value={mobo.usb3_1}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "usb3_1", payload: value });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.2"
            value={mobo.usb3_2}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "usb3_2", payload: value });
            }}
          />
          <DefaultNumberInput
            title="Portas USB-C"
            value={mobo.usbTypeC}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "usbTypeC", payload: value });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas SATA"
            value={mobo.sata}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "sata", payload: value });
            }}
          />
          <DefaultNumberInput
            title="Portas M.2"
            value={mobo.m2}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "m2", payload: value });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas PCI Express"
            value={mobo.pcieX16}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "pcieX16", payload: value });
            }}
          />
          <div className="flex flex-col">
            <label htmlFor="pciGen">Verção PCI-E</label>
            <select
              name="pciGen"
              id="pciGen"
              required
              value={mobo.pciGen}
              className="default-select-input"
              onChange={(e) => {
                dispatch({ type: "pciGen", payload: e.target.value });
              }}
            >
              <option value="">Selecionar Versão</option>
              <option value="1">PCI 1.0</option>
              <option value="2">PCI 2.0</option>
              <option value="3">PCI 3.0</option>
              <option value="4">PCI 4.0</option>
              <option value="5">PCI 5.0</option>
            </select>
          </div>
          <div className="form-item flex flex-col">
            <label htmlFor="wifi">Data de Lançamento</label>

            <input
              type="date"
              name="releaseDate"
              className="default-date-input"
              id="releaseDate"
              value={mobo.launchDate?.toISOString().split("T")[0] || "00/00/0000"}
              onChange={(e) => {
                dispatch({ type: "launchDate", payload: e.target.valueAsDate });
              }}
            />

          </div>
        </div>
        <div className="form-item flex flex-col">
          <label htmlFor="wifi">Observações</label>
          <textarea name="obs" id="obs" className="default-text-input border p-1" value={mobo.obs || ""} onChange={(e) => {
            dispatch({ type: "obs", payload: e.target.value });
          }}></textarea>

        </div>
        <button type="submit" className="primary-button">Salvar</button>
      </form>
    </div>
  );
};

export default function MotherBoard() {
  const [createMode, setCreateMode] = React.useState(false);
  const [currentMobo, setCurrentMobo] = React.useState<MotherBoard | null>(null);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");

  const mobos = api.parts.motherBoards.getAll.useQuery({
    skip: page-1,
    searchTerm: searchTerm,
  }, { refetchOnWindowFocus: false })

  if (createMode || currentMobo) {
    return <MotherBoarForm back={() => {
      setCreateMode(false)
      setCurrentMobo(null)
    }} moboToEdit={currentMobo || undefined} />;
  }



  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Placas Mãe</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          {mobos.data?.count ? `${mobos.data.count} placas encontradas` : "Carregando..."}
        </span>
      </div>
      <button className="primary-button" onClick={() => setCreateMode(true)}>
        Incluir
      </button>
      <table className="default-table mt-4">
        <thead>
          <tr>
            <th colSpan={3}><TableSearchForm numberOfPages={mobos.data?.count || 1}
            page={page}
            setPage={(value) => setPage(value)}
            refresh={() => void mobos.refetch()}
            setSearchTerm={(value) => setSearchTerm(value)}
            searchTerm={searchTerm}
            /></th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Socket</th>
            <th>Marca</th>
          </tr>
        </thead>
        <tbody>
          {mobos.data?.motherboards?.map((mobo) => (
            <tr key={mobo.id}>
              <td><button className="secondary-button" onClick={() => {setCurrentMobo(mobo)}}>{mobo.name}</button></td>
              <td>{mobo.socket.name}</td>
              <td>{mobo.brand}</td>
            </tr>
          ))}
          {
            mobos.isSuccess && mobos.data?.motherboards?.length === 0 && (
              <tr>
                <td colSpan={3}>Nenhum resultado encontrado</td>
              </tr>
            )
          }
          {
            mobos.isLoading && (
              <tr>
                <td colSpan={3}>Carregando...</td>
              </tr>
            )
          }


        </tbody>
      </table>
    </div>
  );
}

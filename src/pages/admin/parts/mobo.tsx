import React, { useContext } from "react";
import BackButton from "../../../components/navigation/backButton";
import { api } from "../../../utils/api";
import { type MotherBoard, type Part } from "@prisma/client";
import CurrencyInput from "../../../components/input/currencyInput";
import DefaultTextInput from "../../../components/input/defaultTextInput";
import DefaultNumberInput from "../../../components/input/defaultNumberInput";
import SelectRamType from "../../../components/input/selectRam";
import SelectChipset from "../../../components/input/selectChipset";
import SelectSocket from "../../../components/input/selectSocket";
import { AppContext } from "../../../components/context/AppContext";
import TableSearchForm from "../../../components/input/tableSearchForm";
import ConfirmDialog from "../../../components/input/confirmDialog";
import { type OmitDynamicFields } from "../../../types/helper_types";
import { PartType } from "../../../types/parts";

export type Mobo = OmitDynamicFields<Part> & {
  motherBoard: MotherBoard;
};


type MoboActions = keyof Mobo;

const motherBoardInitialState: Mobo = {
  id: "",
  name: "",
  type: PartType.MOTHERBOARD,
  brand: "",
  price: 0.0,
  image: "",
  link: "",
  motherBoard: {
    partId: "",
    id: "",
    socketId: "",
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
    launchDate: null,
  },
  obs: "",
};

const moboReducer = (
  state: Mobo,
  action: {
    type: MoboActions;
    payload: string | number | boolean | undefined | null | Date | typeof motherBoardInitialState.motherBoard;
  }
): Mobo => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const MotherBoarForm = ({
  back,
  moboToEdit,
}: {
  back: (refetch: boolean) => void;
  moboToEdit?: Mobo;
}) => {
  const { toast } = useContext(AppContext);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const createOrUpdate =
    api.parts.motherBoards.admin.createOrUpdate.useMutation({
      onSuccess: () => {
        toast.success("Placa mãe salva com sucesso!");
        back(true);
      },
      onError: (err) => {
        toast.error("Erro ao salvar placa mãe!");
        console.error(err);
      },
    });

  const deleteMutation = api.parts.motherBoards.admin.delete.useMutation({
    onSuccess: () => {
      toast.success("Placa mãe deletada com sucesso!");
      back(true);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Erro ao deletar placa mãe!");
    },
  });

  const [mobo, dispatch] = React.useReducer(
    moboReducer,
    moboToEdit || motherBoardInitialState
  );

  return (
    <div className="w-full p-2 pb-4">
      <BackButton onClick={() => back(false)} />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
        }}
        onConfirm={() => {
          if (moboToEdit?.id) {
            deleteMutation.mutate({ id: moboToEdit.id });
          }
        }}
        title="Deletar placa mãe?"
        confirmText={moboToEdit?.name || "DELETAR"}
      />
      <form
        className="mx-auto flex w-[25rem] flex-col gap-2"
        onSubmit={(e) => {
          const { id, ...data } = mobo;

          createOrUpdate.mutate({ id, data: {...data, price: data.price as number} });

          e.preventDefault();
        }}
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            {moboToEdit ? "Editar" : "Cadastrar"} Placa Mãe
          </h1>
          {mobo.id && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              ID: {mobo.id}
            </span>
          )}
          {mobo.createdAt && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              Criado em: {mobo.createdAt.toLocaleDateString()}
              {mobo.createdBy && (
                <span> por {mobo.createdBy.name || "N/I"}</span>
              )}
            </span>
          )}
          {mobo.updatedAt && (
            <span className="text-sm text-[var(--color-neutral-2)]">
              Ultima atualização em: {mobo.updatedAt.toLocaleDateString()}
              {mobo.updatedBy && (
                <span> por {mobo.updatedBy.name || "N/I"}</span>
              )}
            </span>
          )}
        </div>
        {moboToEdit && (
          <button
            type="button"
            className="primary-button w-[8rem]"
            onClick={() => setConfirmDelete(true)}
          >
            Deletar
          </button>
        )}
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
          value={mobo.motherBoard.socketId}
          required
          setValue={(value) => dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, socketId: value } })} 
            />
        <SelectChipset
          required
          value={mobo.motherBoard.chipsetId}
          socketId={mobo.motherBoard.socketId}
          setValue={(value) => {
            dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, chipsetId: value } });
          }}
        />
        <div className="form-item flex flex-col">
          <label htmlFor="price">Preço Base</label>
          <CurrencyInput
            value={mobo.price as number}
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
            value={mobo.motherBoard.ramSlots}
            placeholder="4"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramSlots: value } });
            }}
          />
          <SelectRamType
            value={mobo.motherBoard.ramType}
            setValue={(value) => {
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramType: value } });
            }}
          />
        </div>
        <DefaultNumberInput
          title="Tamanho Máximo de Memória RAM (GB)"
          value={mobo.motherBoard.ramMaxSize}
          placeholder="4"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramMaxSize: value } });
          }}
        />
        <DefaultNumberInput
          title="Velocidade Máxima de Memória RAM (MHz)"
          value={mobo.motherBoard.ramMaxSpeed}
          placeholder="3200"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramMaxSpeed: value } });
          }}
        />
        <DefaultNumberInput
          title="Canais de Memória RAM"
          value={mobo.motherBoard.ramChannels}
          placeholder="2"
          setValue={(value) => {
            if (value < 0) return;
            dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramChannels: value } });
          }}
        />

        <div className="form-item flex flex-col">
          <label htmlFor="ramEcc">Suporta ECC</label>
          <select
            name="ecc"
            id="ecc"
            className="default-select-input"
            value={mobo.motherBoard.ramEcc ? "true" : "false"}
            onChange={(e) => {
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, ramEcc: e.target.value === "true" } });
            }}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
        <div className="usb grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas USB 2.0"
            value={mobo.motherBoard.usb2}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, usb2: value } });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.0"
            value={mobo.motherBoard.usb3}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, usb3: value } });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.1"
            value={mobo.motherBoard.usb3_1}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, usb3_1: value } });
            }}
          />
          <DefaultNumberInput
            title="Portas USB 3.2"
            value={mobo.motherBoard.usb3_2}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, usb3_2: value } });
            }}
          />
          <DefaultNumberInput
            title="Portas USB-C"
            value={mobo.motherBoard.usbTypeC}
            placeholder="2"
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, usbTypeC: value } });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas SATA"
            value={mobo.motherBoard.sata}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, sata: value } });
            }}
          />
          <DefaultNumberInput
            title="Portas M.2"
            value={mobo.motherBoard.m2}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, m2: value } });
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DefaultNumberInput
            title="Portas PCI Express"
            value={mobo.motherBoard.pcieX16}
            setValue={(value) => {
              if (value < 0) return;
              dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, pcieX16: value } });
            }}
          />
          <div className="flex flex-col">
            <label htmlFor="pciGen">Verção PCI-E</label>
            <select
              name="pciGen"
              id="pciGen"
              required
              value={mobo.motherBoard.pciGen}
              className="default-select-input"
              onChange={(e) => {
                dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, pciGen: e.target.value } });
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
              value={
                mobo.motherBoard.launchDate?.toISOString().split("T")[0] || ""
              }
              onChange={(e) => {
                dispatch({ type: "motherBoard", payload: { ...mobo.motherBoard, launchDate: e.target.valueAsDate } });
              }}
            />
          </div>
        </div>
        <div className="form-item flex flex-col">
          <label htmlFor="wifi">Observações</label>
          <textarea
            name="obs"
            id="obs"
            className="default-text-input border p-1"
            value={mobo.obs || ""}
            onChange={(e) => {
              dispatch({ type: "obs", payload: e.target.value });
            }}
          ></textarea>
        </div>
        <button type="submit" className="primary-button">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default function MotherBoard() {
  const [createMode, setCreateMode] = React.useState(false);
  const [currentMobo, setCurrentMobo] = React.useState<Mobo | null>(
    null
  );
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");

  const mobos = api.parts.motherBoards.getAll.useQuery(
    {
      skip: page - 1,
      searchTerm: searchTerm,
      take: 10,
    },
    { refetchOnWindowFocus: false }
  );

  React.useEffect(() => {
    if (currentMobo === null) return void mobos.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMobo]);

  if (createMode || currentMobo) {
    return (
      <MotherBoarForm
        back={(refetch) => {
          setCreateMode(false);
          setCurrentMobo(null);
          if (refetch) void mobos.refetch();
        }}
        moboToEdit={currentMobo || undefined}
      />
    );
  }

  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Placas Mãe</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          {mobos.data?.count
            ? `${mobos.data.count} placas encontradas`
            : "Carregando..."}
        </span>
      </div>
      <button className="primary-button" onClick={() => setCreateMode(true)}>
        Incluir
      </button>
      <table className="default-table mt-4">
        <thead>
          <tr>
            <th colSpan={3}>
              <TableSearchForm
                numberOfPages={mobos.data?.pages || 1}
                page={page}
                setPage={(value) => setPage(value)}
                refresh={() => void mobos.refetch()}
                setSearchTerm={(value) => setSearchTerm(value)}
                searchTerm={searchTerm}
              />
            </th>
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
              <td>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setCurrentMobo({...mobo, motherBoard: mobo.motherBoard as MotherBoard});
                  }}
                >
                  {mobo.name}
                </button>
              </td>
              <td>{mobo.motherBoard?.socket?.name}</td>
              <td>{mobo.brand}</td>
            </tr>
          ))}
          {mobos.isSuccess && mobos.data?.motherboards?.length === 0 && (
            <tr>
              <td colSpan={3}>Nenhum resultado encontrado</td>
            </tr>
          )}
          {mobos.isLoading && (
            <tr>
              <td colSpan={3}>Carregando...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

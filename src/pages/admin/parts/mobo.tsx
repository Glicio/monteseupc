import React from "react";
import BackButton from "../../../components/navigation/backButton";
import { api } from "../../../utils/api";
import { type MotherBoard } from "@prisma/client";
import CurrencyInput from "../../../components/input/currencyInput";

type MoboActions = keyof MotherBoard;

const motherBoardInitialState: MotherBoard = {
  id: "",
  name: "",
  socketId: "",
  brand: "",
  price: 0,
  image: "",
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
  pcieX4: 1,
  size: "ATX",
  chipsetId: "",
};

const moboReducer = (
  state: MotherBoard,
  action: { type: MoboActions; payload: string | number }
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
  const sockets = api.parts.sockets.getAll.useQuery({}, {refetchOnWindowFocus: false});
  const chipsets = api.parts.chipsets.getAll.useQuery({}, {refetchOnWindowFocus: false});

  const [mobo, dispatch] = React.useReducer(
    moboReducer,
    moboToEdit || motherBoardInitialState
  );

  return (
    <div>
      <BackButton onClick={back} />
      <form className="mx-auto w-[20rem]">
        <input
          className="default-text-input"
          type="text"
          value={mobo.name}
          onChange={(e) => {
            dispatch({ type: "name", payload: e.target.value });
          }}
          placeholder="Modelo"
        />
        <input
          className="default-text-input"
          type="text"
          value={mobo.brand}
          onChange={(e) => {
            dispatch({ type: "brand", payload: e.target.value });
          }}
          placeholder="Marca"
        />
        <CurrencyInput value={mobo.price} setValue={(value) => {dispatch({type: "price", payload: value})}}/>
        

      </form>
    </div>
  );
};

export default function MotherBoard() {
  const [createMode, setCreateMode] = React.useState(false);

  if (createMode) {
    return <MotherBoarForm back={() => setCreateMode(false)} />;
  }

  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Placas Mãe</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          Carregando...
        </span>
      </div>
      <button className="primary-button" onClick={() => setCreateMode(true)}>
        Incluir
      </button>
      <table className="default-table mt-4">
        <thead>
          <tr>
            <th colSpan={3}>{/* <TableSearchForm /> */}</th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Socket</th>
            <th>Marca</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

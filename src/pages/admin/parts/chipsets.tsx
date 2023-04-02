import { type Chipset } from "@prisma/client";
import React, { useContext, useEffect } from "react";
import BackButton from "../../../components/navigation/backButton";
import { api } from "../../../utils/api";
import { AppContext } from "../../../components/context/AppContext";
import Refresh from "../../../components/svg/refresh";
import ConfirmDialog from "../../../components/input/confirmDialog";
import SimplePagination from "../../../components/input/simplePagination";
import TableSearchForm from "../../../components/input/tableSearchForm";

interface ChipsetFormProps extends Omit<Chipset, "id"> {
  socketId: string;
}

const ChipsetForm = ({
  chipsetToEdit,
  back,
}: {
  back: () => void;
  chipsetToEdit?: Chipset | null;
}) => {
  const [chipset, setChipset] = React.useState<ChipsetFormProps>(
    chipsetToEdit || { name: "", brand: "", socketId: "" }
  );
  const [toDelete, setToDelete] = React.useState(false);

  const sockets = api.parts.sockets.getAll.useQuery({}, { refetchOnWindowFocus: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChipset({ ...chipset, [name]: value });
  };

  const { toast } = useContext(AppContext);

  const createChipsetMutation = api.parts.chipsets.admin.create.useMutation({
    onSuccess: () => {
      toast.success("Chipset criado com sucesso");
      back();
    },
  });
  const updateChipsetMutation = api.parts.chipsets.admin.update.useMutation({
    onSuccess: () => {
      toast.success("Chipset atualizado com sucesso");
      back();
    },
  });
  const deleteChipsetMutation = api.parts.chipsets.admin.delete.useMutation({
    onSuccess: () => {
      toast.success("Chipset excluído com sucesso");
      back();
    },
  });

  return (
    <div className="p-2">
      <BackButton onClick={back} />
      {chipsetToEdit?.id && (
        <ConfirmDialog
          open={toDelete}
          title="Excluir Chipset"
          confirmText={chipsetToEdit.name}
          onClose={() => setToDelete(false)}
          onConfirm={() => {
            deleteChipsetMutation.mutate({ id: chipsetToEdit.id });
          }}
        ></ConfirmDialog>
      )}

      <form
        className="mx-auto flex w-[20rem] flex-col gap-2 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (chipsetToEdit) {
            return updateChipsetMutation.mutate({
              id: chipsetToEdit.id,
              ...chipset,
            });
          }
          createChipsetMutation.mutate(chipset);
        }}
      >
        <div className="header flex items-center justify-between">
          <h2 className="text-xl">
            {chipsetToEdit ? "Editar Chipset" : "Adicionar novo Chipset"}
          </h2>
          {chipsetToEdit ? (
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setToDelete(true);
              }}
            >
              Excluir
            </button>
          ) : null}
        </div>
        <input
          type="text"
          name="name"
          required
          className="default-text-input"
          value={chipset.name}
          onChange={handleInputChange}
          placeholder="Nome"
        />
        <input
          type="text"
          name="brand"
          required
          className="default-text-input"
          value={chipset.brand}
          onChange={handleInputChange}
          placeholder="Marca"
        />
        <select
          name="chipset"
          id="chipset"
          className="default-select-input"
          value={chipset.socketId}
          required
          onChange={(e) => {
            setChipset({ ...chipset, socketId: e.target.value });
          }}
        >
          <option value="">Selecione um socket</option>
          {sockets.isLoading ? <option>Carregando...</option> : null}
          {sockets.data?.sockets?.map((socket) => (
            <option key={socket.id} value={socket.id}>
              {socket.name}
            </option>
          ))}
        </select>
        <button className="primary-button" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default function Chipsets() {
  const [currentChipset, setCurrentChipset] = React.useState<Chipset | null>();
  const [createMode, setCreateMode] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [page, setPage] = React.useState(1);
  //maximo de itens por pagina
  const limit = 10;

  const chipsetQuery = api.parts.chipsets.getAll.useQuery(
    {
      take: limit,
      skip: (page - 1) * limit,
      searchTerm: searchInput,
    },
    {
      refetchOnWindowFocus: false,
    }
  );



  const closeCreateEditMode = () => {
    setCurrentChipset(null);
    setCreateMode(false);
    void chipsetQuery.refetch();
  };

  if (createMode || currentChipset)
    return (
      <ChipsetForm chipsetToEdit={currentChipset} back={closeCreateEditMode} />
    );

  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Chipsets</h1>

        <span className="text-sm text-[var(--color-neutral-2)]">
          {chipsetQuery.data
            ? `${chipsetQuery.data?.count} encontrados`
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
                numberOfPages={chipsetQuery.data?.pages || 1}
                page={page}
                setPage={(value) => {
                  setPage(value);
                }}
                refresh={() => void chipsetQuery.refetch()}
                setSearchTerm={(value) => setSearchInput(value)}
              />
            </th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Socket</th>
            <th>
              <span className="col-start-2">Marca</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {chipsetQuery.isLoading ? (
            <tr>
              <td colSpan={3}>Carregando...</td>
            </tr>
          ) : null}
          {chipsetQuery.data?.chipsets?.map((chipset) => (
            <tr key={chipset.id}>
              <td>
                <button
                  className="secondary-button"
                  onClick={() => setCurrentChipset(chipset)}
                >
                  {chipset.name}
                </button>
              </td>
              <td>{chipset.socket.name}</td>
              <td>{chipset.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

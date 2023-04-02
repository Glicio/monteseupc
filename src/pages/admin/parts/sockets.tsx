import { type Socket } from "@prisma/client";
import React, { useContext } from "react";
import BackButton from "../../../components/navigation/backButton";
import { api } from "../../../utils/api";
import { AppContext } from "../../../components/context/AppContext";
import Refresh from "../../../components/svg/refresh";
import ConfirmDialog from "../../../components/input/confirmDialog";
import TableSearchForm from "../../../components/input/tableSearchForm";

const SocketForm = ({
  socketToEdit,
  back,
}: {
  back: () => void;
  socketToEdit?: Socket | null;
}) => {
  const [socket, setSocket] = React.useState<Omit<Socket, "id">>(
    socketToEdit || { name: "", brand: "" }
  );
  const [toDelete, setToDelete] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocket({ ...socket, [name]: value });
  };

  const { toast } = useContext(AppContext);

  const createSocketMutation = api.parts.sockets.admin.create.useMutation({
    onSuccess: () => {
      toast.success("Socket criado com sucesso");
      back();
    },
  });
  const updateSocketMutation = api.parts.sockets.admin.update.useMutation({
    onSuccess: () => {
      toast.success("Socket atualizado com sucesso");
      back();
    },
  });
  const deleteSocketMutation = api.parts.sockets.admin.delete.useMutation({
    onSuccess: () => {
      toast.success("Socket excluído com sucesso");
      back();
    },
  });

  return (
    <div className="p-2">
      <BackButton onClick={back} />
      {socketToEdit && (
        <ConfirmDialog
          open={toDelete}
          title="Excluir Socket"
          confirmText={socketToEdit.name}
          onClose={() => setToDelete(false)}
          onConfirm={() => {
            deleteSocketMutation.mutate({ id: socketToEdit.id });
          }}
        ></ConfirmDialog>
      )}

      <form
        className="mx-auto flex w-[20rem] flex-col gap-2 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (socketToEdit) {
            return updateSocketMutation.mutate({
              id: socketToEdit.id,
              ...socket,
            });
          }
          createSocketMutation.mutate(socket);
        }}
      >
        <div className="header flex items-center justify-between">
          <h2 className="text-xl">
            {socketToEdit ? "Editar Socket" : "Adicionar novo Socket"}
          </h2>
          {socketToEdit ? (
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
          className="default-text-input"
          value={socket.name}
          onChange={handleInputChange}
          placeholder="Nome"
        />
        <input
          type="text"
          name="brand"
          className="default-text-input"
          value={socket.brand}
          onChange={handleInputChange}
          placeholder="Marca"
        />
        <button className="primary-button" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default function Sockets() {
  const [currentSocket, setCurrentSocket] = React.useState<Socket | null>();
  const [createMode, setCreateMode] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);

  const socketQuery = api.parts.sockets.getAll.useQuery(
    {
      skip: page-1,
      searchTerm,
      take: 10,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const closeCreateEditMode = () => {
    setCurrentSocket(null);
    setCreateMode(false);
  };

  if (createMode || currentSocket)
    return (
      <SocketForm socketToEdit={currentSocket} back={closeCreateEditMode} />
    );

  return (
    <div className="p-2">
      <div className="header">
        <h1 className="text-2xl">Sockets</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          {socketQuery.data?.count
            ? `${socketQuery.data?.count} encontrados`
            : "Carregando..."}
        </span>
      </div>
      <button className="primary-button" onClick={() => setCreateMode(true)}>
        Incluir
      </button>
      <table className="default-table mt-4">
        <thead>
          <tr>
            <th colSpan={2}>
              <TableSearchForm
                numberOfPages={socketQuery.data?.pages || 1}
                page={page}
                refresh={() => {
                  void socketQuery.refetch();
                }}
                setSearchTerm={(value) => setSearchTerm(value)}
                setPage={(value) => setPage(value)}

              />
            </th>
          </tr>
          <tr>
            <th>Nome</th>
            <th>
              <div className="grid grid-cols-3 items-center">
                <span className="col-start-2">Marca</span>
                <button
                  className="col-start-3 ml-auto mr-2 h-4 w-4"
                  onClick={() => void socketQuery.refetch()}
                >
                  <Refresh />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {socketQuery.isLoading ? (
            <tr>
              <td colSpan={2}>Carregando...</td>
            </tr>
          ) : null}
          {socketQuery.data?.sockets?.map((socket) => (
            <tr key={socket.id}>
              <td>
                <button
                  className="secondary-button"
                  onClick={() => setCurrentSocket(socket)}
                >
                  {socket.name}
                </button>
              </td>
              <td>{socket.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

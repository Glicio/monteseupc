import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { type User } from "@prisma/client";

import style from "./usersDashboard.module.css";
import BackButton from "../../../components/navigation/backButton";
import Image from "next/image";
import UserCircle from "../../../components/svg/userCircle";
import { AppContext } from "../../../components/context/AppContext";
import ConfirmDialog from "../../../components/input/confirmDialog";
import TableSearchForm from "../../../components/input/tableSearchForm";

const RoleText = ({ text }: { text: "ADMIN" | "MOD" | "USER" }) => {
  if (text === "ADMIN")
    return (
      <p>
        Ao confirmar, o usuário terá acesso a todas as funcionalidades de
        administrador.
        <br />{" "}
        <span className="font-bold text-red-400">
          O usuário só pode ter um cargo por vez.
        </span>
      </p>
    );
  if (text === "MOD")
    return (
      <p>
        Ao confirmar, o usuário terá acesso a todas as funcionalidades de
        moderador.
        <br />{" "}
        <span className="font-bold text-red-400">
          O usuário só pode ter um cargo por vez.
        </span>
      </p>
    );
  return (
    <p>
      Ao confirmar, o usuário perderar os direitos de administrador/moderador,
      caso você estiver retirando suas própias permissões perderá o acesso à
      este painel!
    </p>
  );
};

const UserController = ({ user, back }: { user: User; back: () => void }) => {
  const { toast } = useContext(AppContext);

  const [confirmAdmin, setConfirmAdmin] = useState(false);
  const [confirmMod, setConfirmMod] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);

  const promote = api.user.admin.setRole.useMutation({
    onSuccess: () => {
      toast.success("Usuário promovido com sucesso!");
      setConfirmAdmin(false);
      setConfirmMod(false);
    },
    onError: () => {
      toast.error("Erro ao promover usuário!");
    },
  });

  const banUser = api.user.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário banido com sucesso!");
      setConfirmBan(false);
    },
    onError: () => {
      toast.error("Erro ao banir usuário!");
    },
  });

  return (
    <div>
      <BackButton onClick={() => back()} />
      {/* Confirmar que quer dar/tirar direitos de admin */}
      <ConfirmDialog
        onClose={() => setConfirmAdmin(false)}
        onConfirm={() =>
          promote.mutate({ id: user.id, role: user.isAdmin ? "USER" : "ADMIN" })
        }
        description={<RoleText text={user.isAdmin ? "USER" : "ADMIN"} />}
        open={confirmAdmin}
        confirmText={user.name || "CONFIRMAR"}
        title={user.isAdmin ? "Remover Admin" : "Tornar Admin"}
      />
      {/* Confirmar que quer dar/tirar direitos de mod */}
      <ConfirmDialog
        onClose={() => setConfirmMod(false)}
        description={<RoleText text={user.isMod ? "USER" : "MOD"} />}
        onConfirm={() =>
          promote.mutate({
            id: user.id,
            role: user.isAdmin ? "USER" : "MODERATOR",
          })
        }
        open={confirmMod}
        confirmText={user.name || "CONFIRMAR"}
        title={user.isMod ? "Remover Moderador" : "Tornar Moderador"}
      />
      {/* Confirmar que quer banir usuário */}
      <ConfirmDialog
        onClose={() => setConfirmBan(false)}
        onConfirm={() =>
          banUser.mutate({
            id: user.id,
            ban: !user.isBanned,
          })
        }
        open={confirmBan}
        confirmText={
          user.isBanned
            ? `DESBANIR ${user.name?.toUpperCase() || "USUÁRIO"}`
            : `BANIR ${user.name?.toUpperCase() || "USUÁRIO"}`
        }
        title={user.isBanned ? "Desbanir Usuário?" : "Banir Usuário?"}
      />
      <div className="mx-auto w-[25rem]">
        <div className="pfp mx-auto h-24 w-24 overflow-hidden rounded-full">
          {user.image ? (
            <Image
              alt="user profile picture"
              width={128}
              height={128}
              src={user.image}
            />
          ) : (
            <UserCircle />
          )}
        </div>
        <div className="flex flex-wrap">
          <button
            className="primary-button"
            onClick={() => {
              setConfirmAdmin(true);
            }}
          >
            {user.isAdmin ? "Remover Admin" : "Tornar Admin"}
          </button>
          <button
            className="primary-button"
            onClick={() => {
              setConfirmMod(true);
            }}
          >
            {user.isMod ? "Remover Moderador" : "Tornar Moderador"}
          </button>
          <button
            className="primary-button"
            onClick={() => setConfirmBan(true)}
          >
            {user.isBanned ? "Desbanir Usuário" : "Banir Usuário"}
          </button>
          <button className="primary-button">Silenciar</button>
        </div>
        <table
          className={["default-table mt-2", style.userInfoTable].join(" ")}
        >
          <tbody>
            <tr>
              <td>Nome</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Data de Cadastro</td>
              <td>{user.createdAt.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Último Login</td>
              <td>{user.lastLogin.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <span className="text-red-500">Administrador</span>
              </td>
              <td>{user.isAdmin ? "Sim" : "Não"}</td>
            </tr>
            <tr>
              <td>
                <span className="text-yellow-500">Moderador</span>
              </td>
              <td>{user.isMod ? "Sim" : "Não"}</td>
            </tr>
            <tr>
              <td>
                <span className="text-gray-500">Silenciado</span>
              </td>
              <td>{user.isMutted ? "Sim" : "Não"}</td>
            </tr>
            <tr>
              <td>
                <span className="text-gray-500">Banido</span>
              </td>
              <td>{user.isBanned ? "Sim" : "Não"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserComponent = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  const usersList = api.user.admin.getAll.useQuery(
    {
      skip: page-1,
      take: limit,
      searchTerm,
    },
    { refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log(data);
      
    }
     }
  );

  if (currentUser)
    return (
      <UserController user={currentUser} back={() => setCurrentUser(null)} />
    );

  return (
    <div className="w-full p-2">
      <div className="header">
        <h1 className="text-2xl">Usuários</h1>
        <span className="text-sm text-[var(--color-neutral-2)]">
          {usersList.data?.count
            ? `${usersList.data?.count} encontrados`
            : "Carregando..."}
        </span>
      </div>

      <table className="default-table">
        <thead>
          <tr>
            <td colSpan={2}>
              <TableSearchForm
                numberOfPages={usersList.data?.pages || 1}
                page={page}
                refresh={() => {
                  void usersList.refetch();
                }}
                setSearchTerm={(value) => setSearchTerm(value)}
                setPage={(value) => setPage(value)}
              />
            </td>
          </tr>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {!!usersList.data &&
            usersList.data.users.map((user) => (
              <tr key={user.id}>
                <td>
                  <button
                    onClick={() => {
                      setCurrentUser(user);
                    }}
                    className="hover:text-[var(--color-contrast)]"
                  >
                    {user.name}
                  </button>
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
          {usersList.isLoading && (
            <tr>
              <td colSpan={2}>Carregando...</td>
            </tr>
          )}
          {usersList.isError && (
            <tr>
              <td colSpan={2}>Erro ao carregar usuários</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserComponent;

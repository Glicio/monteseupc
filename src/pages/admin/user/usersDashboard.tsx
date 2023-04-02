import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { type User } from "@prisma/client";

import style from "./usersDashboard.module.css";
import BackButton from "../../../components/navigation/backButton";
import Image from "next/image";
import UserCircle from "../../../components/svg/userCircle";
import { AppContext } from "../../../components/context/AppContext";
import ConfirmDialog from "../../../components/input/confirmDialog";



const RoleText = ({text}: {text: "ADMIN" | "MOD" | "USER"}) => {


  if(text === "ADMIN") return (
    <p>Ao confirmar, o usuário terá acesso a todas as funcionalidades de administrador.<br/> <span className="font-bold text-red-400">O usuário só pode ter um cargo por vez.</span></p>
  )
  if(text === "MOD") return (
    <p>Ao confirmar, o usuário terá acesso a todas as funcionalidades de moderador.<br/> <span className="font-bold text-red-400">O usuário só pode ter um cargo por vez.</span></p>
  )
  return (
    <p>Ao confirmar, o usuário perderar os direitos de administrador/moderador, caso você estiver retirando suas própias permissões perderá o acesso à este painel!</p>
  )
}

const UserController = ({ user, back }: { user: User; back: () => void }) => {
  const { toast } = useContext(AppContext);

  const [confirmAdmin, setConfirmAdmin] = useState(false);
  const [confirmMod, setConfirmMod] = useState(false);

  const promote = api.user.admin.setRole.useMutation({
    onSuccess: () => {
      toast.success("Usuário promovido com sucesso!");
      setConfirmAdmin(false);
      setConfirmMod(false)
    },
    onError: () => {
      toast.error("Erro ao promover usuário!");
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
        description={<RoleText text={user.isAdmin ? "USER" : "ADMIN"}/>}
        open={confirmAdmin}
        confirmText={user.name || "CONFIRMAR"}
        title={user.isAdmin ? "Remover Admin" : "Tornar Admin"}
      />
      {/* Confirmar que quer dar/tirar direitos de mod */}
      <ConfirmDialog
        onClose={() => setConfirmMod(false)}
        description={<RoleText text={user.isMod ? "USER" : "MOD"}/>}
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
          <button className="primary-button"
            onClick={() => {setConfirmMod(true)}}
          >
            {user.isMod ? "Remover Moderador" : "Tornar Moderador"}
          </button>
          <button className="primary-button">Banir</button>
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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const usersMutation = api.user.admin.get.useMutation({
    onSuccess: (data) => {
      setUsers(data.users);
      setUserCount(data.count);
    },
  });

  useEffect(() => {
    usersMutation.mutate({ searchTerm: "" });
  }, []);

  if (currentUser)
    return (
      <UserController user={currentUser} back={() => setCurrentUser(null)} />
    );

  return (
    <div className="w-full ">
      <span>{userCount} usuários encontrados</span>
      <div>
        <label htmlFor="limit ">Limite</label>
        <select
          id="limit"
          className="ml-2 text-black"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table className="default-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {!usersMutation.isLoading &&
            users.length > 0 &&
            users.map((user) => (
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
          {usersMutation.isLoading && (
            <tr>
              <td colSpan={2}>Carregando...</td>
            </tr>
          )}
          {usersMutation.isError && (
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

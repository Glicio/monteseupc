import React, { useEffect, useState } from 'react'
import { api } from '../../../utils/api';
import { type User } from '@prisma/client';

import style from "./usersDashboard.module.css"




const UserController = ({user, back}: {user: User, back: () => void}) => {
    return (
        <div>
            <div className={style.userInfoRow}>
                <span>Nome: </span>
                <span>{user.name}</span>
            </div>
            <div className={style.userInfoRow}>
                <span>Email: </span>
                <span>{user.email}</span>
            </div>
            <div className={style.userInfoRow}>
                <span>Data de Cadastro: </span>
                <span>{user.createdAt.toLocaleString()}</span>
            </div>
            <div className={style.userInfoRow}>
                <span>Último Login: </span>
                <span>{user.lastLogin.toLocaleString()}</span>
                </div>
        </div>
    )
}


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
  
    if(currentUser) return (
        <UserController user={currentUser} back={() => setCurrentUser(null)} />
    )

    return (
      <div className="w-full ">
          <span>{userCount} usuários encontrados</span>
        <div >
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
                  <td><button onClick={() => {setCurrentUser(user)}} className='hover:text-[var(--color-contrast)]'>{user.name}</button></td>
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
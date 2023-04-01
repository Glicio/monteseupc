import React, { useEffect, useState } from 'react'
import { api } from '../../../utils/api';
import { User } from '@prisma/client';

const UserComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
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
                  <td>{user.name}</td>
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
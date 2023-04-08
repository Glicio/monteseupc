import React from "react";

const CPUForm = () => {
    return (
        <div className="p-2">
            

        </div>
    )
}


export default function CPU() {
  const [createMode, setCreateMode] = React.useState(false);

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

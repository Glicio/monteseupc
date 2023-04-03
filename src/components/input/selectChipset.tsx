import React from "react";
import { api } from "../../utils/api";

export default function SelectChipset({
  value,
  setValue,
  socketId,
  required,
}: {
  value: string;
  setValue: (value: string) => void;
  socketId?: string;
  required?: boolean;
}) {
  const chipsets = api.parts.chipsets.getAll.useQuery(
    {
      socketId,
    },
    { refetchOnWindowFocus: false, enabled: !!socketId && socketId !== "" }
  );

  return (
    <div className="form-item relative flex flex-col">
      <label htmlFor="chipset">Chipset</label>

      <select
        name="socket"
        id="socket"
        className="default-select-input"
        required={required || false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {chipsets.data && chipsets.data.chipsets.length > 0 && (
          <option value="">Selecione um Chipset</option>
        )}
        {chipsets.data?.chipsets?.map((chipset) => (
          <option key={chipset.id} value={chipset.id}>
            {chipset.name}
          </option>
        ))}
        {chipsets.isError ? <option value={""}>Erro ao carregar</option> : null}
        {!chipsets.isLoading &&
        !chipsets.isError &&
        !chipsets.data?.chipsets?.length ? (
          <option value={""}>Nenhum chipset encontrado</option>
        ) : null}
        {!socketId ? (
          <option value={""}>Selecione o socket antes</option>
        ) : null}
      </select>
    </div>
  );
}

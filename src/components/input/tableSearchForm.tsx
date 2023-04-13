import React, { useEffect } from "react";
import SimplePagination from "./simplePagination";
import Refresh from "../svg/refresh";

export default function TableSearchForm({
  searchTerm,
  setSearchTerm,
  page,
  setPage,
  numberOfPages,
  refresh
}: {
  setSearchTerm: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  numberOfPages: number;
  refresh: () => void;
  searchTerm?: string;
}) {

  const [input, setInput] = React.useState<string>(searchTerm || "");

  useEffect(() => {
    const searchDebounce = setTimeout(() => {
      setSearchTerm(input);
    }
    , 500);

    return () => {
      clearTimeout(searchDebounce);
    }
  },[input])

  return (
    <div className="col-start-3 ml-auto mr-2 flex w-fit items-center justify-end gap-2">
      <input
        type="text"
        className="default-text-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Procurar"
      />
      <SimplePagination
        numberOfPages={numberOfPages}
        page={page}
        setPage={(value) => setPage(value)}
      />
      <button className=" h-4 w-4" onClick={() => refresh()}>
        <Refresh />
      </button>
    </div>
  );
}

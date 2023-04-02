import React from "react";
import SimplePagination from "./simplePagination";
import Refresh from "../svg/refresh";

export default function TableSearchForm({
  searchInput,
  setSearchInput,
  page,
  setPage,
  numberOfPages,
  refresh
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  numberOfPages: number;
  refresh: () => void;
}) {
  return (
    <div className="col-start-3 ml-auto mr-2 flex w-fit items-center justify-end gap-2">
      <input
        type="text"
        className="default-text-input"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
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

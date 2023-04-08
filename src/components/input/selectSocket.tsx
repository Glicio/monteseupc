import React from "react";
import { api } from "../../utils/api";
import { type Socket } from "@prisma/client";

export default function SelectSocket({
  value,
  setValue,
  required,
}: {
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
}) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [searchTermDebounced, setSearchTermDebounced] =
    React.useState<string>("");
  const [active, setActive] = React.useState<boolean>(false);
  const [selectedSocket, setSelectedSocket] = React.useState<Socket | null>();

  const prevSocket = api.parts.sockets.getOne.useQuery(
    { id: value },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: false,
      onSuccess: (data) => {
        setSelectedSocket(data);
      },
    }
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (value) {
      void prevSocket.refetch();
    }
  }, []);

  const sockets = api.parts.sockets.getAll.useQuery(
    {
      searchTerm: searchTermDebounced,
      take: 10,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: searchTermDebounced.length > 0,
    }
  );

  const resetSocket = () => {
    setSelectedSocket(null);
    sockets.remove();
    setValue("");
    setSearchTerm("");
  };

  React.useEffect(() => {
    sockets.remove();
    const timeout = setTimeout(() => {
      setSearchTermDebounced(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  if (selectedSocket) {
    return (
      <div className="relative flex w-full flex-col">
        <label htmlFor="socket" className="text-sm font-bold">
          Socket
        </label>
        <button className="default-text-input text-left" onClick={resetSocket}>
          {selectedSocket.name}
        </button>
      </div>
    );
  }
  return (
    <div className="relative flex w-full flex-col" ref={containerRef}>
      <label htmlFor="socket" className="text-sm font-bold">
        Socket
      </label>
      <input
        className="default-text-input"
        type="text"
        required={required || false}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onFocus={() => {
          setActive(true);
        }}
        placeholder="Ex: LGA 1151"
      />
      {sockets.data?.sockets && sockets.data?.sockets?.length > 0 && active && (
        <div className="absolute top-[100%] z-10 flex w-full flex-col gap-2 border bg-[var(--color-neutral-1)] p-2">
          {sockets.data?.sockets?.map((socket) => {
            return (
              <button
                key={socket.id}
                className="secondary-button"
                onClick={() => {
                  setSelectedSocket(socket);
                  setValue(socket.id);
                }}
              >
                {socket.name}
              </button>
            );
          })}
          
        </div>
      )}
      {(sockets.isFetching && active) ? (
            <div className="absolute top-[100%] z-10 flex w-full flex-col gap-2 border bg-[var(--color-neutral-1)] p-2">
            <div className="secondary-button text-white">Carregando...</div>
            </div>
          ): null}
    </div>
  );
}

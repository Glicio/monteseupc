import React, { useEffect } from "react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  confirmText,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  description?: string | React.ReactNode;
}) {

    const [confirmInput, setConfirmInput] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    useEffect(() => {
        setError("")
    },[confirmInput])

  if (!open) return null;
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-[var(--color-neutral-1)] p-4 shadow-lg w-[25rem]">
        <h2 className="text-xl">{title}</h2>
        {description ? <p className="mt-2">{description}</p> : null}
        {confirmText ? (
            <div className="flex flex-col gap-2 mt-4">
                <p>{`Por Favor, digite "${confirmText}" para confirmar a ação!`}</p>
                {error ? <p className="text-red-500">{error}</p> : null}
                <input
                    type="text"
                    className="default-text-input"
                    placeholder={confirmText}
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                />
            </div>
        ) : null}
        <div className="flex justify-end mt-2">
          <button className="secondary-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-button ml-2" onClick={() => {
                if (confirmText && confirmInput !== confirmText) {
                    return setError("Texto de confirmação incorreto!");
                }
                return onConfirm();
          }}>
            Confirmar
          </button>

        </div>
      </div>
    </div>
  );
}

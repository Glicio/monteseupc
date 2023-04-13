import React from "react";

export default function DefaultNumberInput({
  value,
  setValue,
  title,
  placeholder,
  required,
}: {
  value: number;
  setValue: (value: number) => void;
  title: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [valueState, setValueState] = React.useState<number | string>(value);

  return (
    <div className="form-item flex w-full flex-col">
      <label className="form-label text-sm font-bold">{title}</label>
      <input
        className="default-text-input"
        type="number"
        required={required || false}
        pattern="[0-9]*"
        value={valueState}
        onKeyDown={(event) => {
          if (
            !/[0-9]/.test(event.key) &&
            event.key !== "Backspace" &&
            event.key !== "ArrowLeft" &&
            event.key !== "ArrowRight" &&
            event.key !== "ArrowUp" &&
            event.key !== "ArrowDown" &&
            event.key !== "Delete" &&
            event.key !== "Tab"
          ) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {
          const value = e.target.value.replace(/^0+/g, "");

          setValueState(value);
          setValue(Math.ceil(Number(value)));
        }}
        placeholder={placeholder || ""}
      />
    </div>
  );
}

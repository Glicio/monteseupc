import React from "react";

export default function DefaultNumberInput({
  value,
  setValue,
  title,
  placeholder,
  required
}: {
  value: number;
  setValue: (value: number) => void;
  title: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="form-item flex flex-col w-full">
      <label className="form-label">{title}</label>
      <input
        className="default-text-input"
        type="number"
        required={required || false}
        value={value}
        onChange={(e) => {
          setValue(Math.ceil(Number(e.target.value)));
        }}
        placeholder={placeholder || ""}
      />
    </div>
  );
}

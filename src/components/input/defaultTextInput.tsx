import React from "react";

export default function DefaultTextInput({
  value,
  setValue,
  title,
  placeholder,
  required
}: {
  value: string;
  setValue: (value: string) => void;
  title: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="form-item flex flex-col">
      <label className="form-label">{title}</label>
      <input
        className="default-text-input"
        type="text"
        required={required || false}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder || ""}
      />
    </div>
  );
}

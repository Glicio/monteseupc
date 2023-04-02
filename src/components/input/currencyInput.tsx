import React from "react";
import styles from "./currencyInput.module.css"

export default function CurrencyInput({
  value,
  setValue,
  locale,
  currencyLength,
}: {
  value: number;
  setValue: (value: number) => void;
  locale?: string;
currencyLength?: number;
}) {

    const [input, setInput] = React.useState(value ? String(value) : "")

    const inputRef = React.useRef<HTMLInputElement>(null);

    const getFormattedValue = (value: number) => {
        return new Intl.NumberFormat(locale || "pt-BR", {style: "currency", currency: "BRL"}).format(value/100 || 0)
    }

  return (
    <div className="relative">
      <input
        type="number"
        className="default-text-input z-10 absolute"
        
        style={{
            backgroundColor: "transparent",
            color: "transparent",
            
        }}
        onKeyDown={(e) => {
            if(e.key === "." || e.key === ",") e.preventDefault();
        }}
        value={input}
        onChange={(e) => {
            if(/\D/g.test(e.target.value)) return;
            const value = e.target.value
            setInput(value);
            setValue(value ? Number(value) : 0);
            if(inputRef.current){
                inputRef.current.setSelectionRange(value.length, value.length)
            }
        }}
      />
      <input
        type="text"
        className={["default-text-input absolute", styles["fake-input"]].join(" ")}
        style={{
            backgroundPosition: `${(getFormattedValue(value).length-0.5)/2}rem center`,
        }}
        ref={inputRef}

        value={getFormattedValue(value)}
      />
    </div>
  );
}
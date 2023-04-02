import React from "react";
import styles from "./currencyInput.module.css"


/**
* @param value - the real value of the input
* @param setValue - the function to set the value
* @param locale - the locale to be used in the input
* @param currencyLength - the length of the currency symbol, defaults to 2
* @returns a currency input that shows a formatted value (real value / 100) and sets the real value to a integer (not float)
*/

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
    <div className="relative h-[1.5rem] flex w-full">
      <input
        type="number"
        className=" z-10 w-full"
        
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
        className={["default-text-input absolute w-full", styles["fake-input"]].join(" ")}
        style={{
            backgroundPosition: `${(getFormattedValue(value).length-0.5)/2}rem center`,
        }}
        ref={inputRef}

        value={getFormattedValue(value)}
      />
    </div>
  );
}

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
  max,
  min
}: {
  value: number;
  setValue: (value: number) => void;
  locale?: string;
  max?: number;
  min?: number;
}) {

    const [input, setInput] = React.useState(value ? String(value) : "")


    const getFormattedValue = (value: number) => {
        return new Intl.NumberFormat(locale || "pt-BR", {style: "currency", currency: "BRL"}).format(value/100 || 0)
    }

  return (
    <div className="relative h-[1.5rem] flex w-full">
      <input
        type="number"
        className={[" z-10 w-full", styles["real-input"]].join(" ")}
        
        style={{
            backgroundColor: "transparent",
            color: "transparent",
        }}
        onClick={(e) => {
            e.preventDefault();
            setValue(0);
            setInput("");
        }}
        onKeyDown={(e) => {
            if(isNaN(Number(e.key)) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") e.preventDefault();
        }}
        value={input}
//        tabIndex={-1}
        onChange={(e) => {
            
            const value = e.target.value

            if(max && Number(value) > max) return;
            if(min && Number(value) < min) return;

            if(!max && value.length > 10) return;
            setInput(value);
            setValue(value ? Number(value) : 0);
        }}
      />
      <div 
        className={["default-text-input absolute w-full", styles["fake-input"]].join(" ")}
        style={{
            backgroundPosition: `${(getFormattedValue(value).length-0.5)/2}rem center`,
        }}
      >
            {getFormattedValue(value)}
      </div>
    </div>
  );
}

import React from "react";


interface DefaultFormProps {
    title: string;
    onSubmit: () => void;
    children: React.ReactNode;
}


export default function DefaultForm({title, onSubmit, children}: DefaultFormProps) {
    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold">Informações gerais</h2>
            <form action="" onSubmit={(e) => {e.preventDefault()}}>
            {children}
            </form>
        </div>
);
}

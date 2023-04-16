import React from "react";

interface DefaultFormProps {
    title: string;
    onSubmit: () => void;
    children: React.ReactNode;
}

export default function DefaultForm({
    title,
    onSubmit,
    children,
}: DefaultFormProps) {
    return (
        <div className="flex w-full flex-col">
            <h2 className="text-2xl font-bold">{title}</h2>
            <form
                action=""
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                {children}
            </form>
        </div>
    );
}

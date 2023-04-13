import React from "react";
import CheveronRight from "../svg/cheveron-right";
import CheveronLeft from "../svg/cheveron-left";

const Elipsis = () => {

    return (
        <span className="h-fit w-fit min-w-[1.5rem] text-center">...</span>
    )
}



const PaginationButton = ({
    number,
    currentPage,
    setPage,
}: {
    number: number;
    currentPage: number;
    setPage: (value: number) => void;
}) => {
    return (
        <button
            disabled={number === currentPage}
            className={`h-fit w-fit min-w-[1.5rem]  ${
                number === currentPage ? "bg-[var(--color-neutral-1)]" : "hover:text-[var(--color-contrast)]"
            }`}
            onClick={() => setPage(number)}
        >
            {number}
        </button>
    );
};

const getPaginationButtons = (
    totalPages: number,
    page: number,
    setPage: (value: number) => void
) => {
    const buttons: React.ReactNode[] = [];
    if (totalPages <= 9) {
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <PaginationButton
                    number={i}
                    currentPage={page}
                    setPage={setPage}
                />
            );
        }

        return buttons;
    }

    if (page < 8) {
        for (let i = 1; i <= 7 && i < totalPages; i++) {
            buttons.push(
                <PaginationButton
                    number={i}
                    currentPage={page}
                    setPage={setPage}
                />
            );
        }
        buttons.push(<Elipsis/>)
        buttons.push(
            <PaginationButton
                number={totalPages}
                currentPage={page}
                setPage={setPage}
            />
        );
        return buttons;
    }

    if (page > 7 && page < totalPages - 6) {
        buttons.push(
            <PaginationButton number={1} currentPage={page} setPage={setPage} />
        );
        buttons.push(<Elipsis/>);
        for (let i = page - 2; i <= page + 2; i++) {
            buttons.push(
                <PaginationButton
                    number={i}
                    currentPage={page}
                    setPage={setPage}
                />
            );
        }
        buttons.push(<Elipsis/>);
        buttons.push(
            <PaginationButton
                number={totalPages}
                currentPage={page}
                setPage={setPage}
            />
        );
        return buttons;
    }

    if (page >= totalPages - 6) {
        buttons.push(
            <PaginationButton number={1} currentPage={page} setPage={setPage} />
        );

        buttons.push(<Elipsis/>);
        for (let i = totalPages - 6; i <= totalPages; i++) {
            buttons.push(
                <PaginationButton
                    number={i}
                    currentPage={page}
                    setPage={setPage}
                />
            );
        }
    }

    return buttons;
};

export default function DefaultPagination({
    page,
    setPage,
    totalPages,
}: {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}) {
    return (
        <div className="flex gap-1 ">
            <button
                className={`mr-1  ${page === 1 ? "text-transparent" : "hover:text-[var(--color-contrast)]"}`}
                onClick={() => {
                    if (page > 1) {
                        setPage(page - 1);
                    }
                }}
            >
                <CheveronLeft />
            </button>
            {getPaginationButtons(totalPages, page, setPage).map(
                (button) => button
            )}
            <button
            className={`ml-1 ${page === totalPages ? "text-transparent" : "hover:text-[var(--color-contrast)]"}`}
                onClick={() => {
                    if (page < totalPages) {
                        setPage(page + 1);
                    }
                }}
            >
                <CheveronRight />
            </button>
        </div>
    );
}

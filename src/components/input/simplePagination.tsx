import React from 'react'
import ArrowLeft from '../svg/arrowLeft';
import ArrorRight from '../svg/arrowRight';

export default function SimplePagination({page, setPage, numberOfPages}:{page: number, setPage: (value: number) => void, numberOfPages: number}) {
    return (
        <div className="flex justify-center items-center h-4 gap-2">
            <button
                className={page <= 1 ? " text-transparent": "secondary-button"}
                type="button"
                disabled={page <= 1}
                onClick={() => {
                    if(page <= 1) return
                    setPage(page - 1);
                }
            }>
               <ArrowLeft/>
            </button>
            <span>{page}/{numberOfPages}</span>
            <button
                className={page >= numberOfPages ? " text-transparent": "secondary-button"}
                disabled={page >= numberOfPages}
                type="button"
                onClick={() => {
                    if(page >= numberOfPages) return
                    setPage(page + 1);
                }
            }>
               <ArrorRight/>
            </button>
        </div>
    )
}
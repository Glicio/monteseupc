import React from 'react'

export default function NavBar() {
    return (
        <header className=' h-[var(--nav-bar-height)] bg-[var(--color-primary)] text-[var(--color-text-primary)] flex items-center px-2 border-b border-[var(--color-neutral-1)]'>
            <h1 className='text-[var(--color-contrast)] font-extrabold text-xl'>Logo</h1>
        </header>
    )
}
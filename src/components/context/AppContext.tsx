import React from 'react'
import { toast } from 'react-toastify'


export const AppContext = React.createContext({toast: toast})



export const AppProvider = ({ children }: {children: React.ReactNode}) => {

    
    
    return (
        <AppContext.Provider value={{toast: toast}}>
        {children}
        </AppContext.Provider>
    )
}
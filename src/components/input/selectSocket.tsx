import React from 'react'
import { api } from '../../utils/api'

export default function SelectSocket({value, setValue, required}: {value: string, setValue: (value:string) => void, required?: boolean}) {
    
    const sockets = api.parts.sockets.getAll.useQuery({}, {refetchOnWindowFocus: false})

    return (


        <div className='w-full flex flex-col'>
            <label htmlFor="socket">Socket</label>
            <select required={required || false} name="socket" id="socket" className='default-select-input' value={value} onChange={(e) => setValue(e.target.value)}>
                <option value="">Selecione um socket</option>
                {sockets.data?.sockets?.map(socket => (
                    <option key={socket.id} value={socket.id}>{socket.name}</option>
                ))}
            </select>
            
        </div>
    )
}
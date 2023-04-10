import React from 'react'

export default function SelectRamType({value, setValue}: {value: string, setValue: (value:string) => void}) {
    return (
        <div className='flex flex-col whitespace-nowrap'>
            <label htmlFor="ramType">Tipo de Memória</label>
            <select name="ramType" id="ramType" className='default-select-input' value={value} onChange={(e) => setValue(e.target.value)}>
                <option value="DDR5">DDR5</option>
                <option value="DDR4">DDR4</option>
                <option value="DDR3">DDR3</option>
                <option value="DDR2">DDR2</option>
                <option value="DDR">DDR</option>
            </select>

        </div>
    )
}

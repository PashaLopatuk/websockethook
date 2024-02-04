import React, {createContext, useState} from 'react';

interface ISelectContext {
    SelectedRows: string[]
    setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>
}
export const SelectContext = createContext({} as ISelectContext)

const SelectProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [SelectedRows, setSelectedRows] = useState<string[]>([])

    const value = {
        SelectedRows, setSelectedRows
    }

    return (
        <SelectContext.Provider value={value}>
            {children}
        </SelectContext.Provider>
    )
}
export default SelectProvider;
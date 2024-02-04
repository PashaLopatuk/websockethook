import React from 'react';
import CustomTable from "../CustomTable/CustomTable.tsx";

const data = [
    {
        'apple': 1,
        'orange': 2,
        'pine': 3
    },
    {
        'apple': 4,
        'orange': 5,
        'pine': 6
    },
    {
        'apple': 7,
        'orange': 8,
        'pine': 9
    },
]
const SelectTable = () => {
    return (
        <CustomTable
            title={''}
            data={data}
            columns={{
                    'apple': {
                        dataField: 'apple'
                    },
                    'orange': {
                        dataField: 'orange'
                    },
                    'pine': {
                        dataField: 'pine'
                    },
                }}
        />
    )
}

export default SelectTable;
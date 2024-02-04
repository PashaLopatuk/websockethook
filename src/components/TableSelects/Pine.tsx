import React from 'react';
import {Box} from "@mui/joy";
import SelectProvider from "./SelectProvider.tsx";
import SelectTable from "./SelectTable.tsx";

const Pine = () => {
    return (
        <SelectProvider>
            <Box>
                <SelectTable />
            </Box>
        </SelectProvider>
    )
}

export default Pine;
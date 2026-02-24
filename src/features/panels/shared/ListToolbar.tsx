import {Box} from "@mui/material";
import type {ReactNode} from "react";
import SearchIcon from '@mui/icons-material/Search';

interface ListToolbarProps {
    buttons?: ReactNode[];
    filters?: ReactNode[];
}

const ListToolbar = ({buttons, filters}: ListToolbarProps) => {
    return (
        <Box sx={{display: 'flex', flexDirection: "row", gap: 0.5, minHeight: 32, mb: 1, mt: 1, alignItems: 'center'}}>
            {filters && filters.length > 0 && (
                <SearchIcon color={"primary"} fontSize={"large"} />
            )}
            <Box sx={{display: 'flex', flexDirection: "row", gap: 1}}>
                {filters?.map((filterComponent) => (
                    <>{filterComponent}</>
                ))}
            </Box>
            {buttons?.map((buttonComponent) => (
                <>{buttonComponent}</>
            ))}
        </Box>
    )
}

export default ListToolbar;
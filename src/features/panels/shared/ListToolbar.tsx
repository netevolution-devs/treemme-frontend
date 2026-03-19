import {Box, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import SearchIcon from '@mui/icons-material/Search';

interface ListToolbarProps {
    label?: ReactNode;
    buttons?: ReactNode[];
    filters?: ReactNode[];
    sx?: SxProps;
    alignButtons?: 'flex-start' | 'flex-end';
}

const ListToolbar = ({label, buttons, filters, sx, alignButtons = 'flex-start'}: ListToolbarProps) => {
    return (
        <Box sx={{display: 'flex', flexDirection: "row", gap: 0.5, minHeight: 32, mb: 1, mt: 0.5, alignItems: 'center', ...sx}}>
            {filters && filters.length > 0 && (
                <>
                    <SearchIcon color={"primary"} fontSize={"small"}/>
                    <Box sx={{display: 'flex', flexDirection: "row", gap: 1, alignItems: 'end'}}>
                        {filters?.map((filterComponent) => (
                            <>{filterComponent}</>
                        ))}
                    </Box>
                </>
            )}
            {label && (
                <Box sx={{width: '100%'}}>
                    {label}
                </Box>
            )}
            <Box sx={{display: 'flex', justifyContent: alignButtons, gap: 0.8, width: '100%'}}>
                {buttons?.map((buttonComponent) => (
                    <>{buttonComponent}</>
                ))}
            </Box>
        </Box>
    )
}

export default ListToolbar;
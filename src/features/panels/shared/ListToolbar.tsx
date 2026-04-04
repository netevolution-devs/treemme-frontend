import {Box, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import SearchIcon from '@mui/icons-material/Search';

interface ListToolbarProps {
    label?: ReactNode;
    buttons?: ReactNode[];
    filters?: ReactNode[];
    sx?: SxProps;
    alignButtons?: 'start' | 'flex-end';
}

const ListToolbar = ({label, buttons, filters, sx, alignButtons = 'start'}: ListToolbarProps) => {
    return (
        <Box sx={{display: 'flex', flexDirection: "row", gap: 0.5, minHeight: 32, mb: 1, alignItems: 'center', ...sx}}>
            {filters && filters.length > 0 && (
                <Box sx={{display: 'flex', flexDirection: "row", gap: 1, alignItems: 'center', ml: 0.7}}>
                    <SearchIcon color={"primary"} fontSize={"medium"} sx={{mt: 0.8, mr: -0.5}}/>
                    <Box sx={{display: 'flex', flexDirection: "row", gap: 1, alignItems: 'end', mt: 1}}>
                        {filters?.map((filterComponent) => (
                            <>{filterComponent}</>
                        ))}
                    </Box>
                </Box>
            )}
            {label && (
                <Box sx={{display: 'inline', textWrap: 'nowrap', mr: 1}}>
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
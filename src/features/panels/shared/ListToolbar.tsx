import {Box, IconButton, Tooltip, CircularProgress, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ListToolbarProps {
    label?: ReactNode;
    buttons?: ReactNode[];
    filters?: ReactNode[];
    sx?: SxProps;
    alignButtons?: 'start' | 'flex-end';
    onExport?: () => void;
    exportLoading?: boolean;
}

const ListToolbar = ({label, buttons, filters, sx, alignButtons = 'start', onExport, exportLoading}: ListToolbarProps) => {
    return (
        <Box sx={{display: 'flex', flexDirection: "row", flexWrap: 'wrap', gap: 0.5, minHeight: 32, mb: 1, alignItems: 'center', ...sx}}>
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
            <Box sx={{display: 'flex', justifyContent: alignButtons, gap: 0.8, flex: 1, alignItems: 'center', pt: 0.8, pl: 0.4}}>
                {buttons?.map((buttonComponent) => (
                    <>{buttonComponent}</>
                ))}
                {onExport && (
                    <Tooltip title="Export CSV">
                        <IconButton onClick={onExport} size="small" sx={{ml: 'auto'}}>
                            {exportLoading ? <CircularProgress size={18}/> : <FileDownloadIcon/>}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    )
}

export default ListToolbar;
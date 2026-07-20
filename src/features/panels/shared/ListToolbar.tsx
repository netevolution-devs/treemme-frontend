import {Box, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CustomButton from "@features/panels/shared/CustomButton";
import {useExportCSVFn} from "@features/panels/shared/hooks/ExportCSVContext";

interface ListToolbarProps {
    label?: ReactNode;
    buttons?: ReactNode[];
    filters?: ReactNode[];
    sx?: SxProps;
    alignButtons?: 'start' | 'flex-end';
}

const ListToolbar = ({label, buttons, filters, sx, alignButtons = 'start'}: ListToolbarProps) => {
    const onExport = useExportCSVFn();

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
            <Box sx={{display: 'flex', justifyContent: alignButtons, gap: 0.8, flex: 1}}>
                {buttons?.map((buttonComponent) => (
                    <>{buttonComponent}</>
                ))}
                {onExport && (
                    <CustomButton label={"Export CSV"} onClick={onExport} color={"primary"} icon={<FileDownloadIcon fontSize={"small"}/>}/>
                )}
            </Box>
        </Box>
    )
}

export default ListToolbar;
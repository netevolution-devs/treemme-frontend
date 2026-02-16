import {Box, type SxProps} from "@mui/material";
import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
    sx?: SxProps | undefined;
}

const BaseSettingsContainer = ({children}: Props) => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{px: 3, pt: 2, minWidth: "70%", maxWidth: 1200}}>
                {children}
            </Box>
        </Box>
    )
}

export default BaseSettingsContainer;
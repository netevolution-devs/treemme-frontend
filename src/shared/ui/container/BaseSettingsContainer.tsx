import {Box, Stack, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import ButtonGoToApp from "@ui/ButtonGoToApp";

interface Props {
    children: ReactNode;
    sx?: SxProps | undefined;
}

const BaseSettingsContainer = ({children}: Props) => {

    return (
        <Box sx={{display: "flex", justifyContent: 'center'}}>
            <Stack sx={{minWidth: "70%", maxWidth: 1200}} spacing={2}>
                <Box>
                    <ButtonGoToApp/>
                </Box>
                <Box>
                    {children}
                </Box>
            </Stack>
        </Box>
    )
}

export default BaseSettingsContainer;
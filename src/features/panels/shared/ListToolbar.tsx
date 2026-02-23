import {Box} from "@mui/material";
import type {ReactNode} from "react";

interface ListToolbarProps {
    buttons: ReactNode[];
}
const ListToolbar = ({buttons}: ListToolbarProps) => {
    return (
        <Box sx={{display: 'flex', flexDirection: "row", gap: 1, height: 32, mb: 1}}>
            {buttons.map((buttonComponent) => (
                <>
                    {buttonComponent}
                </>
            ))}
        </Box>
    )
}

export default ListToolbar;
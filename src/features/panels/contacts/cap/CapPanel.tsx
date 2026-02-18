import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box, Typography} from "@mui/material";

const CapPanel = () => {
    return (
        <PanelProvider kind={"cap"}>
            <Box>
                <Typography variant="h6">Cap Panel</Typography>
            </Box>
        </PanelProvider>
    )
}

export default CapPanel;
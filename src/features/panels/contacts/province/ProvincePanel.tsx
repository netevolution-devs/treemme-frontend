import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box, Typography} from "@mui/material";

const ProvincePanel = () => {
    return (
        <PanelProvider kind={"province"}>
            <Box>
                <Typography variant="h6">Province Panel</Typography>
            </Box>
        </PanelProvider>
    )
}

export default ProvincePanel;
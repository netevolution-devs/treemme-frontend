import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box} from "@mui/material";
import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";

const ProvincePanel = () => {
    return (
        <PanelProvider kind={"province"}>
            <Box sx={{p: 1}}>
                <ProvinceForm />
            </Box>
        </PanelProvider>
    )
}

export default ProvincePanel;
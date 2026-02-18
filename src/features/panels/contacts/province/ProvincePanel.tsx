import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box} from "@mui/material";
import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";

export interface IProvinceStoreState {
    isFormDisabled: boolean;
}

const ProvincePanel = () => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true};

    return (
        <PanelProvider<unknown, IProvinceStoreState>
            kind={"province"}
            initialState={{uiState: initialUiState}}
        >
            <Box sx={{p: 1}}>
                <ProvinceForm />
            </Box>
        </PanelProvider>
    )
}

export default ProvincePanel;
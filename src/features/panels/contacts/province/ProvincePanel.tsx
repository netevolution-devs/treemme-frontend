import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box} from "@mui/material";
import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";
import ProvinceList from "@features/panels/contacts/province/ProvinceList.tsx";

export interface IProvinceStoreState {
    isFormDisabled: boolean;
    selectedProvinceId?: number;
}

const ProvincePanel = () => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true};

    return (
        <PanelProvider<unknown, IProvinceStoreState>
            kind={"province"}
            initialState={{uiState: initialUiState}}
        >
            <Box sx={{p: 1, display: "flex"}}>
                <ProvinceList />
                <ProvinceForm />
            </Box>
        </PanelProvider>
    )
}

export default ProvincePanel;
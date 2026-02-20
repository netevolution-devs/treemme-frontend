import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import {Box} from "@mui/material";
import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";
import ProvinceList from "@features/panels/contacts/province/ProvinceList.tsx";
import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";

export interface IProvinceStoreState extends IPanelUIState {
    selectedProvinceId?: number | null;
}

const ProvincePanel = () => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <PanelProvider<unknown, IProvinceStoreState>
            kind={"province"}
            initialState={{uiState: initialUiState}}
        >
            <Box sx={{p: 1, display: "flex", flexDirection: "column", gap: 1}}>
                <ProvinceList />
                <ProvinceForm />
            </Box>
        </PanelProvider>
    )
}

export default ProvincePanel;
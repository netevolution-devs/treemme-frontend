import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";
import ProvinceList from "@features/panels/contacts/province/ProvinceList.tsx";
import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IProvinceStoreState extends IPanelUIState {
    selectedProvinceId?: number | null;
}

const ProvincePanel = () => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProvinceStoreState>
            kind={"province"}
            initialState={{uiState: initialUiState}}
        >
            <ProvinceList />
            <ProvinceForm />
        </GenericPanel>
    )
}

export default ProvincePanel;
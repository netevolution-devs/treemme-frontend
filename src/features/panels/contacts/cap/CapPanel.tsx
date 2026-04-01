import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import CapList from "@features/panels/contacts/cap/CapList.tsx";
import CapForm from "@features/panels/contacts/cap/CapForm.tsx";

export interface ICapStoreState extends IPanelUIState {
    selectedCapId?: number | null;
}

const CapPanel = () => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICapStoreState>
            kind={"cap"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <CapList/>
            }
        >
            <CapForm />
        </GenericPanel>
    )
}

export default CapPanel;
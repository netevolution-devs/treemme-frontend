import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel";
import GenericPanel from "@features/panels/shared/GenericPanel";
import CapList from "@features/panels/contacts/cap/CapList";
import CapForm from "@features/panels/contacts/cap/CapForm";

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
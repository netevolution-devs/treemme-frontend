import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ReasonsList from "@features/panels/shipping-invoicing/reasons/ReasonsList";
import ReasonsForm from "@features/panels/shipping-invoicing/reasons/ReasonsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IReasonsStoreState extends IPanelUIState {
    selectedDeliveryReasonId?: number | null;
}

const ReasonsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IReasonsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IReasonsStoreState>
            kind={"reasons"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            listComponent={<ReasonsList/>}
        >
            <ReasonsForm/>
        </GenericPanel>
    )
}

export default ReasonsPanel;

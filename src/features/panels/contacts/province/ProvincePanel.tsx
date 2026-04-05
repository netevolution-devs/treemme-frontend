import ProvinceForm from "@features/panels/contacts/province/ProvinceForm";
import ProvinceList from "@features/panels/contacts/province/ProvinceList";
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import type {IDockviewPanelProps} from "dockview";

export interface IProvinceStoreState extends IPanelUIState {
    selectedProvinceId?: number | null;
}

const ProvincePanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IProvinceStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProvinceStoreState>
            kind={"province"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <ProvinceList/>
            }
        >
            <ProvinceForm {...props.params}/>
        </GenericPanel>
    )
}

export default ProvincePanel;
import ProvinceForm from "@features/panels/contacts/province/ProvinceForm.tsx";
import ProvinceList from "@features/panels/contacts/province/ProvinceList.tsx";
import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";
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
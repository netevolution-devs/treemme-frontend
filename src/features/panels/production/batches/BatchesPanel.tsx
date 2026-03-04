import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import BatchesList from "@features/panels/production/batches/BatchesList.tsx";
import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";
import GenericTabContent from "@features/panels/shared/GenericTabContent.tsx";

export interface IBatchesStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

const BatchesPanel = () => {
    const initialUiState: IBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchesStoreState>
            kind={"batches"}
            initialState={{uiState: initialUiState}}
        >
            <BatchesList/>
            <GenericTabContent
                tabs={[
                    {label: "Lotto", component: <BatchesForm/>},
                    {label: "test", component: <>test</>},
                    {label: "test 2", component: <>test 2</>}
                ]}
            />
        </GenericPanel>
    )
}

export default BatchesPanel;

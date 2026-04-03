import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import LotsBatchesList from "@features/panels/warehouse/lots-batches/LotsBatchesList.tsx";
import LotsBatchesDetailList from "@features/panels/warehouse/lots-batches/LotsBatchesDetailList.tsx";

export interface ILotsBatchesStoreState extends IPanelUIState {
    selectedSelectionStockId?: number | null;
}

const LotsBatchesPanel = () => {
    const initialUiState: ILotsBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ILotsBatchesStoreState>
            kind={"lotsBatches"}
            initialState={{uiState: initialUiState}}
            listComponent={<LotsBatchesList/>}
        >
            <LotsBatchesDetailList/>
        </GenericPanel>
    )
}

export default LotsBatchesPanel;

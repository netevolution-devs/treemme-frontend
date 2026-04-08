import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {IWeightsStoreState} from "@features/panels/leathers/weights/WeightsPanel";

const WeightsContent = () => {
    const {useStore} = usePanel<unknown, IWeightsStoreState>();
    const selectedWeightId = useStore((state) => state.uiState.selectedWeightId);

    return (
        <>
            {selectedWeightId && (
                <LeathersList panelFilter={"weight"} selectedQueryId={selectedWeightId} disableBorders/>
            )}
        </>
    )
}

export default WeightsContent;
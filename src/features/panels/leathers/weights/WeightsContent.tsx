import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IWeightsStoreState} from "@features/panels/leathers/weights/WeightsPanel.tsx";

const WeightsContent = () => {
    const {useStore} = usePanel<unknown, IWeightsStoreState>();
    const selectedWeightId = useStore((state) => state.uiState.selectedWeightId);

    return (
        <>
            {selectedWeightId && (
                <LeathersList panelFilter={"weight"} selectedQueryId={selectedWeightId}/>
            )}
        </>
    )
}

export default WeightsContent;
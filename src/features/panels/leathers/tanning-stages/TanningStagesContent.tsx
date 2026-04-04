import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ITanningStagesStoreState} from "@features/panels/leathers/tanning-stages/TanningStagesPanel.tsx";

const TanningStagesContent = () => {
    const {useStore} = usePanel<unknown, ITanningStagesStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedTanningStageId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"status"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default TanningStagesContent;
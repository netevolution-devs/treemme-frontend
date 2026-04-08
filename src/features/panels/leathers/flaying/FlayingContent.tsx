import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel";

const FlayingContent = () => {
    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedFlayId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"flay"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default FlayingContent;
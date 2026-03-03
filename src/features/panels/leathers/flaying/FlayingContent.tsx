import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel.tsx";

const FlayingContent = () => {
    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedFlayId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"flay"} selectedQueryId={selectedId}/>
            )}
        </>
    )
}

export default FlayingContent;
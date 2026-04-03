import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IOriginsStoreState} from "@features/panels/leathers/origins/OriginsPanel.tsx";

const OriginsContent = () => {
    const {useStore} = usePanel<unknown, IOriginsStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedOriginId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"provenance"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default OriginsContent;
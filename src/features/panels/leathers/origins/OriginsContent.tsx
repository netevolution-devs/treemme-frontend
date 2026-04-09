import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {IOriginsStoreState} from "@features/panels/leathers/origins/OriginsPanel";

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
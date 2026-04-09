import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {ITypesStoreState} from "@features/panels/leathers/types/TypesPanel";

const TypesContent = () => {
    const {useStore} = usePanel<unknown, ITypesStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedTypeId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"type"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default TypesContent;
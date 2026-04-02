import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ITypesStoreState} from "@features/panels/leathers/types/TypesPanel.tsx";

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
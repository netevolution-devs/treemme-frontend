import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ISpeciesStoreState} from "@features/panels/leathers/species/SpeciesPanel.tsx";

const SpeciesContent = () => {
    const {useStore} = usePanel<unknown, ISpeciesStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedSpeciesId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"species"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default SpeciesContent;
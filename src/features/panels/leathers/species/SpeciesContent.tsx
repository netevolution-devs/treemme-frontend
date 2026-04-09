import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {ISpeciesStoreState} from "@features/panels/leathers/species/SpeciesPanel";

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
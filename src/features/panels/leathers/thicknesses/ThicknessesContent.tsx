import LeathersList from "@features/panels/leathers/leathers/LeathersList";
import {usePanel} from "@ui/panel/PanelContext";
import type {IThicknessesStoreState} from "@features/panels/leathers/thicknesses/ThicknessesPanel";

const ThicknessesContent = () => {
    const {useStore} = usePanel<unknown, IThicknessesStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedThicknessId);

    return (
        <>
            {selectedId && (
                <LeathersList panelFilter={"thickness"} selectedQueryId={selectedId} disableBorders/>
            )}
        </>
    )
}

export default ThicknessesContent;
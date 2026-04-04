import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IThicknessesStoreState} from "@features/panels/leathers/thicknesses/ThicknessesPanel.tsx";

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
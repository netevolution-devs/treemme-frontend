import {Box} from "@mui/material";
import {PANEL_REGISTRY} from "@features/panels/PanelRegistry.tsx";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {DockviewReact} from "dockview";
import {StyledDockviewWrapper} from "@themes/dockviewTheme.tsx";

const PanelContainerPage = () => {
    const {handleReady} = useDockviewStore(state => state);

    return (
        <Box height="calc(100vh - 48px)">
            <StyledDockviewWrapper>
                <DockviewReact
                    className="dockview-theme-mui"
                    components={PANEL_REGISTRY}
                    onReady={handleReady}
                />
            </StyledDockviewWrapper>
        </Box>
    )
}

export default PanelContainerPage;
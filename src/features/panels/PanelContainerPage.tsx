import {Box} from "@mui/material";
import {PANEL_REGISTRY} from "@features/panels/PanelRegistry.tsx";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {DockviewReact} from "dockview";

const PanelContainerPage = () => {
    const {handleReady} = useDockviewStore(state => state);

    return (
        <Box height="100vh">
            {/*{BUTTONS.map((button) => <Button onClick={() => handleOpenPanel(button)}>{button.label}</Button>)}*/}
            <DockviewReact
                components={PANEL_REGISTRY}
                onReady={handleReady}
            />
        </Box>
    )
}

export default PanelContainerPage;
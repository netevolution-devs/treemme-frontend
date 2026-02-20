import {Box, useTheme} from "@mui/material";
import {PANEL_REGISTRY} from "@features/panels/PanelRegistry.tsx";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {DockviewReact} from "dockview";
import {StyledDockviewWrapper} from "@themes/dockviewTheme.tsx";
import {themeLight} from "dockview";
import {themeDark} from "dockview";

const PanelContainerPage = () => {
    const {handleReady} = useDockviewStore(state => state);
    const materialTheme = useTheme();

    const isLightTheme = materialTheme.palette.mode === 'light';

    return (
        <Box height="calc(100vh - 48px)">
            <StyledDockviewWrapper>
                <DockviewReact
                    theme={isLightTheme
                        ? themeLight
                        : themeDark
                    }
                    className="dockview-theme-mui"
                    components={PANEL_REGISTRY}
                    onReady={handleReady}
                />
            </StyledDockviewWrapper>
        </Box>
    )
}

export default PanelContainerPage;
import {Box, useTheme} from "@mui/material";
import {PANEL_REGISTRY} from "@features/panels/PanelRegistry";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import {DockviewReact} from "dockview";
import {StyledDockviewWrapper} from "@themes/dockviewTheme";
import {themeLight} from "dockview";
import {themeDark} from "dockview";
import {useEffect} from "react";
import CustomDockviewTab from "@ui/panel/CustomDockviewTab";

const PanelContainerPage = () => {
    const {handleReady, api} = useDockviewStore(state => state);
    const materialTheme = useTheme();

    const isLightTheme = materialTheme.palette.mode === 'light';

    useEffect(() => {
        const handleResize = () => {
            if (api) {
                api.layout(
                    window.innerWidth,
                    window.innerHeight
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [api]);

    return (
        <Box height="calc(100vh - 48px)" width="100%">
            <StyledDockviewWrapper>
                <DockviewReact
                    defaultTabComponent={CustomDockviewTab}
                    floatingGroupBounds="boundedWithinViewport"
                    watermarkComponent={() => (
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 48px)', width: '100%'}}>
                            <img src={"imgs/watermark.png"} alt="Watermark" width={600} />
                        </Box>
                    )}
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
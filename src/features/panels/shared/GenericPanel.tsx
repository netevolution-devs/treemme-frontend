import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import type {TPanelKind} from "@features/panels/PanelRegistry.tsx";
import {Box, Stack} from "@mui/material";
import type {PanelState} from "@ui/panel/store/PanelStore.ts";
import type {ReactNode} from "react";

interface GenericPanelProps<F, U> {
    kind: TPanelKind;
    initialState: Partial<PanelState<F, U>>;
    children?: ReactNode;
    listComponent?: ReactNode;
    disableBorders?: boolean;
    disableContent?: boolean;
}

const GenericPanel = <F, U>({
                                kind,
                                initialState,
                                children,
                                listComponent,
                                disableBorders = false,
                                disableContent = false,
                            }: GenericPanelProps<F, U>) => {
    return (
        <PanelProvider<F, U>
            kind={kind}
            initialState={initialState}
        >
            <Box sx={{
                p: !disableBorders ? 1.5 : 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflowY: "auto",
                height: "100%",
                minHeight: 0,
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "background.panel",
            }}>
                <Stack gap={1.5} sx={{height: "100%"}}>
                    {listComponent}
                    {!disableContent && (
                        <Stack gap={0.5} sx={{
                            flex: 1,
                            borderTop: !disableBorders ? "6px solid" : "none",
                            borderRadius: 1,
                            borderColor: "primary.main",
                            backgroundColor: "background.paper",
                            p: 1,
                        }}>
                            {children}
                        </Stack>
                    )}
                </Stack>
            </Box>
        </PanelProvider>
    );
};

export default GenericPanel;
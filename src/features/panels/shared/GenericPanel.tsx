import {PanelProvider} from "@ui/panel/PanelContext.tsx";
import type {TPanelKind} from "@features/panels/PanelRegistry.tsx";
import {Box} from "@mui/material";
import type {PanelState} from "@ui/panel/store/PanelStore.ts";
import type {ReactNode} from "react";

interface GenericPanelProps<F, U> {
    kind: TPanelKind;
    initialState: Partial<PanelState<F, U>>;
    children: ReactNode;
}

const GenericPanel = <F, U>({
                                       kind,
                                       initialState,
                                       children
                                   }: GenericPanelProps<F, U>) => {
    return (
        <PanelProvider<F, U>
            kind={kind}
            initialState={initialState}
        >
            <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                {children}
            </Box>
        </PanelProvider>
    );
};

export default GenericPanel;
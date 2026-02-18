import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel.tsx";

export type TPanelKind =
    | 'cap'
    | 'not-implemented';

export type DockviewComponents = Record<TPanelKind, FunctionComponent<IDockviewPanelProps>>;

export const PANEL_REGISTRY: DockviewComponents = {
    cap: () => <CapPanel />,
    "not-implemented": () => <>Test panel</>,
}
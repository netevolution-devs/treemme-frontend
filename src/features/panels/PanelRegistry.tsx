import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel.tsx";
import ProvincePanel from "@features/panels/contacts/province/ProvincePanel.tsx";

export type TPanelKind =
    | 'cap'
    | 'province'
    | 'not-implemented';

export type DockviewComponents = Record<TPanelKind, FunctionComponent<IDockviewPanelProps>>;

export const PANEL_REGISTRY: DockviewComponents = {
    cap: () => <CapPanel />,
    province: () => <ProvincePanel />,
    "not-implemented": () => <>To implement</>,
}
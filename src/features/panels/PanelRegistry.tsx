import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel.tsx";
import ProvincePanel from "@features/panels/contacts/province/ProvincePanel.tsx";
import NationsPanel from "@features/panels/contacts/nations/NationsPanel.tsx";
import ContactsPanel from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import SeaportsPanel from "@features/panels/contacts/seaports/SeaportsPanel.tsx";

export type TPanelKind =
    | 'cap'
    | 'province'
    | 'nations'
    | 'contacts'
    | 'seaports'
    | 'not-implemented';

export type DockviewComponents = Record<TPanelKind, FunctionComponent<IDockviewPanelProps>>;

export const PANEL_REGISTRY: DockviewComponents = {
    cap: () => <CapPanel />,
    province: () => <ProvincePanel />,
    nations: () => <NationsPanel />,
    contacts: () => <ContactsPanel />,
    seaports: () => <SeaportsPanel />,
    "not-implemented": () => <>To implement</>,
}
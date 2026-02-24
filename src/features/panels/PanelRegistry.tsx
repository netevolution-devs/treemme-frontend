import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel.tsx";
import ProvincePanel from "@features/panels/contacts/province/ProvincePanel.tsx";
import NationsPanel from "@features/panels/contacts/nations/NationsPanel.tsx";
import ContactsPanel from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import SeaportsPanel from "@features/panels/contacts/seaports/SeaportsPanel.tsx";
import WeightsPanel from "@features/panels/leathers/weights/WeightsPanel.tsx";
import SpeciesPanel from "@features/panels/leathers/species/SpeciesPanel.tsx";
import SizesPanel from "@features/panels/leathers/sizes/SizesPanel.tsx";
import LeathersPanel from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import ThicknessesPanel from "@features/panels/leathers/thicknesses/ThicknessesPanel.tsx";
import TypesPanel from "@features/panels/leathers/types/TypesPanel.tsx";
import FlayingPanel from "@features/panels/leathers/flaying/FlayingPanel.tsx";
import OriginsPanel from "@features/panels/leathers/origins/OriginsPanel.tsx";
import TanningStagesPanel from "@features/panels/leathers/tanning-stages/TanningStagesPanel.tsx";

export type TPanelKind =
    | 'cap'
    | 'province'
    | 'nations'
    | 'contacts'
    | 'seaports'
    | 'weights'
    | 'species'
    | 'sizes'
    | 'leathers'
    | 'thicknesses'
    | 'types'
    | 'flaying'
    | 'origins'
    | 'tanningStages'
    | 'not-implemented';

export type DockviewComponents = Record<TPanelKind, FunctionComponent<IDockviewPanelProps>>;

export const PANEL_REGISTRY: DockviewComponents = {
    cap: () => <CapPanel />,
    province: () => <ProvincePanel />,
    nations: () => <NationsPanel />,
    contacts: () => <ContactsPanel />,
    seaports: () => <SeaportsPanel />,
    weights: () => <WeightsPanel />,
    species: () => <SpeciesPanel />,
    sizes: () => <SizesPanel />,
    leathers: () => <LeathersPanel />,
    thicknesses: () => <ThicknessesPanel />,
    types: () => <TypesPanel />,
    flaying: () => <FlayingPanel />,
    origins: () => <OriginsPanel />,
    tanningStages: () => <TanningStagesPanel />,
    "not-implemented": () => <>To implement</>,
}
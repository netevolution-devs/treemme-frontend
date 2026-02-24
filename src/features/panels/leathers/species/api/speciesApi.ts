import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies.ts";

export const speciesApi = createPanelApi<ISpecies>({
    baseEndpoint: "/leather-species",
    queryKey: "LEATHER-SPECIES"
});
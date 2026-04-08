import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies";

export const speciesApi = createPanelApi<ISpecies>({
    baseEndpoint: "/leather-species",
    queryKey: "LEATHER-SPECIES"
});
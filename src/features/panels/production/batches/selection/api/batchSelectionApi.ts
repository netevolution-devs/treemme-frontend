import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchSelection} from "@features/panels/production/batches/selection/api/IBatchSelection";
import type {
    IBatchSelectionForm,
} from "@features/panels/production/batches/selection/BatchesSelectionFormDialog";

export type IBatchSelectionPayload = IBatchSelectionForm;

export const batchSelectionApi = createPanelApi<IBatchSelection, IBatchSelectionPayload>({
    baseEndpoint: "/batch-selection",
    queryKey: "BATCH-SELECTION"
});
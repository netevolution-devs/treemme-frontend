import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IBatchSelection} from "@features/panels/production/batches/selection/api/IBatchSelection.ts";
import type {
    IBatchSelectionForm,
} from "@features/panels/production/batches/selection/BatchesSelectionFormDialog.tsx";

export type IBatchSelectionPayload = IBatchSelectionForm;

export const batchSelectionApi = createPanelApi<IBatchSelection, IBatchSelectionPayload>({
    baseEndpoint: "/batch_selection",
    queryKey: "BATCH-SELECTION"
});
import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    ISelectionStock,
    ISelectionStockBatch
} from "@features/panels/warehouse/lots-batches/api/ISelectionStock.ts";

export const selectionStockAvailableApi = createPanelApi<ISelectionStock>({
    baseEndpoint: "/selection/stock/available",
    queryKey: "SELECTION-STOCK-AVAILABLE",
});

export const selectionStockAvailableDetailApi = createPanelApi<ISelectionStockBatch[]>({
    baseEndpoint: "/selection/stock/available",
    queryKey: "SELECTION-STOCK-AVAILABLE",
});
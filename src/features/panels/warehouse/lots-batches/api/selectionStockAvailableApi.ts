import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {
    ISelectionStock,
    ISelectionStockBatch
} from "@features/panels/warehouse/lots-batches/api/ISelectionStock";

export const selectionStockAvailableApi = createPanelApi<ISelectionStock>({
    baseEndpoint: "/selection/stock/available",
    queryKey: "SELECTION-STOCK-AVAILABLE",
});

export const selectionStockAvailableDetailApi = createPanelApi<ISelectionStockBatch[]>({
    baseEndpoint: "/selection/stock/available",
    queryKey: "SELECTION-STOCK-AVAILABLE",
});
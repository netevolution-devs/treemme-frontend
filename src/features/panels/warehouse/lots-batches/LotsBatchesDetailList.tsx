import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILotsBatchesStoreState} from "@features/panels/warehouse/lots-batches/LotsBatchesPanel.tsx";
import {
    selectionStockAvailableDetailApi
} from "@features/panels/warehouse/lots-batches/api/selectionStockAvailableApi.ts";
import BatchesList from "@features/panels/production/batches/BatchesList.tsx";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

const LotsBatchesDetailList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ILotsBatchesStoreState>();
    const selectedSelectionStockId = useStore(state => state.uiState.selectedSelectionStockId);

    const {data: selectedSelectionStockDetails = []} = selectionStockAvailableDetailApi.useGetDetail(selectedSelectionStockId);

    const batches = selectedSelectionStockDetails.map(x => x.batch);

    return (
        <>
            <Typography variant={"h6"}>{t("production.batches")}</Typography>
            <BatchesList
                data={batches}
                enableFilters={false}
                disableBorder
                minHeight={"470px"}
            />
        </>
    )
};

export default LotsBatchesDetailList;
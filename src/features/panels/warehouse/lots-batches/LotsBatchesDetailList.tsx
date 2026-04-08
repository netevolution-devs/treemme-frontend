import {usePanel} from "@ui/panel/PanelContext";
import type {ILotsBatchesStoreState} from "@features/panels/warehouse/lots-batches/LotsBatchesPanel";
import {
    selectionStockAvailableDetailApi
} from "@features/panels/warehouse/lots-batches/api/selectionStockAvailableApi";
import BatchesList from "@features/panels/production/batches/BatchesList";
import {MenuItem, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";

const LotsBatchesDetailList = () => {
    const {t} = useTranslation(["form"]);

    const addPanel = useDockviewStore(state => state.addPanel);

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
                additionalOptions={{
                    enableRowActions: true,
                    renderRowActionMenuItems: ({row, closeMenu}) => [
                        <MenuItem key={"view_batch"} onClick={() => {
                            addPanel({
                                id: `batches:${crypto.randomUUID()}`,
                                title: t("menu:menu.production.batches"),
                                component: 'batches',
                                params: {
                                    extra: {
                                        id: row.original.id,
                                        batch_code: row.original.batch_code
                                    }
                                }
                            });
                            closeMenu();
                        }}>
                            <VisibilityIcon color={"primary"} sx={{mr: 1}} />
                            {t("processes.view_batch")}
                        </MenuItem>
                    ],
                }}
            />
        </>
    )
};

export default LotsBatchesDetailList;
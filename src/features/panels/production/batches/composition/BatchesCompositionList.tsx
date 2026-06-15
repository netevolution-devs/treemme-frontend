import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchComposition} from "@features/panels/production/batches/composition/api/IBatchComposition";
import {Typography} from "@mui/material";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import dayjs from "dayjs";
import useCallablePanel from "@ui/panel/useCallablePanel";

interface ICompositionDialogProps {
    customBatchId?: number;
    enableToolbar?: boolean;
}

const BatchesCompositionList = ({customBatchId, enableToolbar = true}: ICompositionDialogProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId) || customBatchId;
    const selectedBatchCompositionId = useStore(state => state.uiState.selectedBatchCompositionId);
    const setUIState = useStore(state => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: batch, isLoading: isLoadingBatch, isFetching: isFetchingBatch} = batchApi.useGetDetail(selectedBatchId as number);
    const {data: batchCompositions = [], isLoading: isLoadingComposition, isFetching: isFetchingComposition} = batchApi.useGetBatchCompositionDetail(selectedBatchId as number);
    const isLoading = isLoadingBatch || isLoadingComposition;
    const isFetching = isFetchingBatch || isFetchingComposition;

    const isTinturaORifinizione = batch?.batch_type.name === "Tintura" || batch?.batch_type.name === "Rifinizione";

    const handleOpenCreateComposition = () => {
        setUIState({selectedBatchCompositionId: null});
        addSelectPanel({
            initialValue: '',
            extra: {
                batch_id: selectedBatchId,
                panelId: "createBatchComposition"
            },
            menu: {
                component: "batchComposition",
                i18nKey: "menu.production.composition"
            },
            customId: "createBatchComposition"
        });
    }

    const handleOpenUpdateComposition = (id: number) => {
        setUIState({selectedBatchCompositionId: id});
        addSelectPanel({
            initialValue: '',
            extra: {
                batch_id: selectedBatchId,
                batch_composition_id: id,
                panelId: "updateBatchComposition:" + id
            },
            menu: {
                component: "batchComposition",
                i18nKey: "menu.production.composition"
            },
            customId: "updateBatchComposition:" + id
        });
    }

    const columns = useMemo<MRT_ColumnDef<IBatchComposition>[]>(() => [
        {
            accessorKey: "date",
            header: isTinturaORifinizione ? t("composition.date-tf") : t("composition.date"),
            Cell: ({row}) => dayjs(row.original.date).format("DD/MM/YYYY")
        },
        {
            accessorKey: "father_batch.batch_code",
            header: t("composition.father_batch_code"),
        },
        {
            accessorKey: "father_batch_piece",
            header: t("composition.father_batch_piece"),
        },
        {
            accessorKey: "father_batch_quantity",
            header: t("composition.father_batch_quantity"),
        },
        {
            accessorKey: "composition_note",
            header: t("composition.composition_note"),
        }
    ], [t, isTinturaORifinizione]);

    return (
        <GenericList<IBatchComposition>
            disableBorder
            minHeight={"265px"}
            columns={columns}
            data={batchCompositions}
            isLoading={isLoading}
            isFetching={isFetching}
            selectedId={selectedBatchCompositionId}
            onRowSelect={(id) => setUIState({selectedBatchCompositionId: id})}
            onRowDoubleClick={(id) => handleOpenUpdateComposition(id)}
            additionalOptions={{
                enableTopToolbar: enableToolbar,
                renderTopToolbar: () => <ListToolbar
                    label={<Typography variant="h6" sx={{mb: enableToolbar ? 0 : 1, textWrap: 'nowrap'}}>{t("composition.title")}</Typography>}
                    buttons={[
                        <CustomButton
                            color={"primary"}
                            icon={<AddToPhotosIcon/>}
                            label={t("composition.button")}
                            onClick={handleOpenCreateComposition}
                            isEnable={!!selectedBatchId && isTinturaORifinizione}
                        />,
                    ]}
                    sx={{mt: 0}}
                    alignButtons={'flex-end'}
                />
            }}
        />
    )
};

export default BatchesCompositionList;
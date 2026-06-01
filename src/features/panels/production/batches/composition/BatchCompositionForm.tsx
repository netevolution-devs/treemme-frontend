import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {Box} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {useWatch} from "react-hook-form";
import dayjs from "dayjs";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import {useEffect, useMemo} from "react";
import type {
    IBatchCompositionStoreParams,
    IBatchCompositionStoreState
} from "@features/panels/production/batches/composition/BatchCompositionPanel";
import {batchCompositionApi} from "@features/panels/production/batches/composition/api/batchCompositionApi";
import useGetBatchSplitAvailability from "@features/panels/production/batches/composition/api/useGetBatchSplitAvailability";
import type {
    IBatchComposition,
} from "@features/panels/production/batches/composition/api/IBatchComposition";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";

export interface IBatchCompositionForm {
    father_batch_piece: number | null;
    father_batch_id: number | null;
    batch_selection_id: number | null;
    composition_note?: string;
    date?: string;
    batch_id: number | null;
}

const BatchCompositionForm = ({
                                   initialName,
                                   onSuccess,
                                   extra
                               }: ICustomPanelFormProps<IBatchCompositionStoreParams>) => {
    const batchId = extra?.batch_id ?? 0;
    const batchCompositionId = extra?.batch_composition_id ?? 0;
    const floatingPanelUUID = extra?.panelId as string;

    const {useStore} = usePanel<unknown, IBatchCompositionStoreState>();
    const selectedStoreId = useStore(state => state.uiState.selectedBatchCompositionId);
    const selectedBatchCompositionId = batchCompositionId || selectedStoreId;

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedBatchCompositionId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = batchCompositionApi;
    const {data: batchCompositionDetail} = useGetDetail(selectedBatchCompositionId);

    const {mutateAsync: createComposition, isPending: isPosting} = usePost({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    const {mutateAsync: updateComposition, isPending: isPutting} = usePut({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    const {mutateAsync: deleteComposition, isPending: isDeleting} = useDelete({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    useEffect(() => {
        if (floatingPanelUUID?.startsWith("createBatchComposition")) {
            setFormState("new");
        }
    }, [floatingPanelUUID, setFormState]);

    const {data: batchesAvailability = []} = useGetBatchSplitAvailability();

    const batches = useMemo(() => {
        const list = [...batchesAvailability];
        if (batchCompositionDetail?.father_batch && !list.find(b => b.id === batchCompositionDetail.father_batch.id)) {
            list.push(batchCompositionDetail.father_batch);
        }
        return list;
    }, [batchesAvailability, batchCompositionDetail?.father_batch]);

    return (
        <GenericForm<IBatchCompositionForm, IBatchComposition, IBatchCompositionStoreState>
            onSuccess={handlePanelSuccess}
            resource="produzione - lotti"
            selectedId={selectedBatchCompositionId}
            floatingPanelUUID={floatingPanelUUID}
            disableUpdateButton={false}
            disableCreateButton
            entity={batchCompositionDetail}
            emptyValues={{
                father_batch_piece: null,
                father_batch_id: null,
                batch_selection_id: null,
                composition_note: '',
                date: dayjs().format('YYYY-MM-DD'),
                batch_id: batchId
            }}
            mapEntityToForm={(entity) => ({
                father_batch_piece: entity.father_batch_piece,
                father_batch_id: entity.father_batch?.id || null,
                batch_selection_id: entity.batch_selection_id || null,
                composition_note: entity.composition_note,
                date: entity.date,
                batch_id: batchId
            })}
            create={(data) => {
                const fatherBatch = batchesAvailability.find(b => b.id === data.father_batch_id);
                const selection = fatherBatch?.batch_selections.find(s => s.id === data.batch_selection_id);
                const quantityPerPiece = (selection && selection.pieces > 0) ? selection.quantity / selection.pieces : 0;
                const calculatedQuantity = (data.father_batch_piece || 0) * quantityPerPiece;

                return createComposition({
                    batch_id: batchId,
                    father_batch_id: data.father_batch_id as number,
                    batch_selection_id: data.batch_selection_id as number,
                    date: data.date as string,
                    composition_note: data.composition_note as string,
                    father_batch_piece: data.father_batch_piece as number,
                    father_batch_quantity: calculatedQuantity
                });
            }}
            update={(_, payload) => {
                const fatherBatch = batches.find(b => b.id === payload.father_batch_id);
                const selection = fatherBatch?.batch_selections.find(s => s.id === payload.batch_selection_id);
                const quantityPerPiece = (selection && selection.pieces > 0) ? selection.quantity / selection.pieces : 0;
                const calculatedQuantity = (payload.father_batch_piece || 0) * quantityPerPiece;

                return updateComposition({
                    id: selectedBatchCompositionId as number,
                    payload: {
                        batch_id: batchId,
                        father_batch_id: payload.father_batch_id as number,
                        batch_selection_id: payload.batch_selection_id as number,
                        date: payload.date as string,
                        composition_note: payload.composition_note as string,
                        father_batch_piece: payload.father_batch_piece as number,
                        father_batch_quantity: calculatedQuantity
                    }
                });
            }}
            remove={() => deleteComposition(selectedBatchCompositionId as number)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            validateBeforeSave={(v) =>
                v.father_batch_piece !== null && v.father_batch_piece > 0 &&
                !!v.batch_selection_id
            }
            renderFields={() => (
                <BatchCompositionFormFields batches={batches}/>
            )}
        />
    );
};

const BatchCompositionFormFields = ({batches}: {batches: IBatch[]}) => {
    const {t} = useTranslation(["form"]);

    const watchedFatherBatchId = useWatch<IBatchCompositionForm>({name: "father_batch_id"});
    const watchedSelectionId = useWatch<IBatchCompositionForm>({name: "batch_selection_id"});
    const batchSelections = batches.find(b => b.id === watchedFatherBatchId)?.batch_selections || [];

    return (
        <Box sx={{mb: 1}}>
            <Box sx={{mb: 1.2}}>
                <DateFieldControlled<IBatchCompositionForm>
                    name={"date"}
                    label={t("production.date")}
                />
            </Box>
            <SelectFieldControlled<IBatchCompositionForm>
                name="father_batch_id"
                label={t("production.batch.father_batch")}
                options={batches.map(b => ({
                    value: b.id,
                    label: `${b.batch_code} - ${b.leather?.name || b.article?.name || ''}`
                }))}
                required
            />
            <SelectFieldControlled<IBatchCompositionForm>
                name="batch_selection_id"
                label={t("production.batch.father_batch_selection")}
                options={batchSelections.map((b) => ({
                    value: b.id,
                    label: `${b.selection?.name || ''} - ${b.thickness?.name || ''} - ${b.stock_pieces} ${t("production.batch.pieces-string")} ${b.note ? '- ' + b.note : ""}`
                }))}
                required
                deactivated={!watchedFatherBatchId}
            />
            <NumberFieldControlled<IBatchCompositionForm>
                name="father_batch_piece"
                label={t("production.batch.pieces")}
                required
                precision={0}
                max={batchSelections.find(b => b.id === watchedSelectionId)?.stock_pieces as number || 0}
                deactivated={!watchedSelectionId}
            />
            <TextFieldControlled<IBatchCompositionForm>
                name="composition_note"
                label={t("production.batch.note")}
                TextFieldProps={{multiline: true, rows: 2}}
            />
        </Box>
    )
}

export default BatchCompositionForm;

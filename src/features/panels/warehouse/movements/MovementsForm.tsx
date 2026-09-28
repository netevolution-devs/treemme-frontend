import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";
import dayjs from "dayjs";
import {usePanel} from "@ui/panel/PanelContext";
import type {IMovementsStoreState, IMovementStoreFilter} from "@features/panels/warehouse/movements/MovementsPanel";
import {warehouseMovementsApi} from "@features/panels/warehouse/movements/api/warehouseMovementsApi";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {IWarehouseMovement} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";

export type IMovementForm = {
    date: string;
    reason: string;
    ddt_number: number | null;
    ddt_date: string;
    batch_code: string;
    piece: number | null;
    product: string;
    contact: string;
    selection: string;
    measurement_unit: string;
    quantity: number | null;
    price: number | null;
    total_value: number | null;
    subcontractor_ddt_number: number | null;
    movement_note: string;
};

const MovementsForm = () => {
    const {t} = useTranslation(["form"]);
    const {useStore} = usePanel<IMovementStoreFilter, IMovementsStoreState>();
    const selectedMovementId = useStore(state => state.uiState.selectedMovementId);
    const setUIState = useStore(state => state.setUIState);
    const {data: movement} = warehouseMovementsApi.useGetDetail(selectedMovementId);

    return (
        <GenericForm<IMovementForm, IWarehouseMovement, IMovementsStoreState>
            resource="magazzino - movimenti"
            readOnly
            selectedId={selectedMovementId}
            entity={movement}
            emptyValues={{
                date: "",
                reason: "",
                ddt_number: null,
                ddt_date: "",
                batch_code: "",
                piece: null,
                product: "",
                contact: "",
                selection: "",
                measurement_unit: "",
                quantity: null,
                price: null,
                total_value: null,
                subcontractor_ddt_number: null,
                movement_note: "",
            }}
            mapEntityToForm={movement => ({
                date: movement.date ? dayjs(movement.date).format("DD/MM/YYYY") : "",
                reason: movement.reason?.name ?? "",
                ddt_number: movement.ddt_number,
                ddt_date: movement.ddt_date ? dayjs(movement.ddt_date).format("DD/MM/YYYY") : "",
                batch_code: movement.batch?.batch_code ?? "",
                piece: movement.piece,
                product: movement.batch?.article?.name ?? movement.batch?.leather?.name ?? "",
                contact: movement.contact?.name ?? "",
                // The API does not currently identify the movement's selection.
                selection: "-",
                measurement_unit: movement.batch?.measurement_unit?.prefix ?? "",
                quantity: movement.quantity,
                price: movement.price,
                total_value: movement.total_value,
                subcontractor_ddt_number: movement.subcontractor_ddt_number,
                movement_note: movement.movement_note ?? "",
            })}
            onClearSelection={() => setUIState({selectedMovementId: null})}
            renderFields={() => (
                <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", md: "repeat(2, minmax(0, 1fr))"}, columnGap: 2}}>
                    <TextFieldControlled<IMovementForm>
                        name="date"
                        label={t("movements.date")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="reason"
                        label={t("movements.reason")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="ddt_number"
                        label={t("movements.ddt_number")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="ddt_date"
                        label={t("movements.ddt_date")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="batch_code"
                        label={t("movements.batch_code")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="piece"
                        label={t("movements.piece")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="product"
                        label={t("movements.product")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="contact"
                        label={t("movements.contact")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="selection"
                        label={t("movements.selection")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="measurement_unit"
                        label={t("movements.measurement_unit")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="quantity"
                        label={t("movements.quantity")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="price"
                        label={t("movements.price")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="total_value"
                        label={t("movements.total_value")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="subcontractor_ddt_number"
                        label={t("movements.subcontractor_ddt_number")}
                    />
                    <TextFieldControlled<IMovementForm>
                        name="movement_note"
                        label={t("movements.movement_note")}
                        TextFieldProps={{multiline: true, minRows: 2}}
                    />
                </Box>
            )}
        />
    );
};

export default MovementsForm;

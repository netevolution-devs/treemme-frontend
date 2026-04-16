import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import {Box, Stack} from "@mui/material";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi";
import {orderRowApi} from "@features/panels/orders/customer-orders/order-rows/api/orderRowApi";
import {articleApi} from "@features/panels/products/articles/api/articleApi";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi";
import TextFieldValue from "@ui/form/controlled/TextFieldValue";
import CurrencyWatcher from "@features/panels/shared/hooks/CurrencyWatcher";
import CustomButton, {NewButton} from "@features/panels/shared/CustomButton";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dye/DyeFormDialog";
import RefinementFormDialog
    from "@features/panels/orders/customer-orders/order-rows/refinement/RefinementFormDialog";
import {openDialog} from "@ui/dialog/dialogHelper";
import SettingsInputHdmiIcon from "@mui/icons-material/SettingsInputHdmi";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import CurrenciesExchangeFormDialog
    from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog";
import {useFormContext, useWatch} from "react-hook-form";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import type {
    IOrderRowsStoreParams,
    IOrderRowsStoreState
} from "@features/panels/orders/customer-orders/order-rows/OrderRowsPanel";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";
import {useAuth} from "@features/auth/model/AuthContext";
import {permissionEngine} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";

export type IOrderRowForm = Omit<IOrderRow,
    'id' |
    'article' |
    'measurement_unit' |
    'currency' |
    'client_order' |
    'available_quantity' |
    'quantity' |
    'selection' |
    'price' |
    'total_price' |
    'total_currency_price' |
    'tolerance_quantity_percentage' |
    'delivery_date_request'
> & {
    id?: number;
    article_id: number | null;
    measurement_unit_id: number | null;
    currency_id: number | null;
    client_order_id: number;
    quantity: number | null;
    selection_id: number | null;
};

const OrderRowsForm = ({initialName, onSuccess, extra}: ICustomPanelFormProps<IOrderRowsStoreParams>) => {
    const {t} = useTranslation(["form"]);

    const clientOrderId = extra?.client_order_id;
    const orderRowId = extra?.order_row_id;

    const {useStore} = usePanel<unknown, IOrderRowsStoreState>();
    const selectedStoreId = useStore(state => state.uiState.selectedOrderRowId);
    const selectedOrderRowId = orderRowId ?? selectedStoreId;
    const setUIState = useStore(state => state.setUIState);

    const floatingPanelUUID = extra?.panelId as string;

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedOrderRowId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = orderRowApi;
    const {data: orderRow} = useGetDetail(selectedOrderRowId);

    const {mutateAsync: createRow, isPending: isPosting} = usePost({
        invalidateQueries: ['CLIENT-ORDER', String(clientOrderId)]
    });
    const {mutateAsync: updateRow, isPending: isPutting} = usePut({
        invalidateQueries: ['CLIENT-ORDER', String(clientOrderId)]
    });
    const {mutateAsync: deleteRow, isPending: isDeleting} = useDelete({
        invalidateQueries: ['CLIENT-ORDER', String(clientOrderId)]
    });

    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: currencies = []} = currencyApi.useGetList();

    const dyeDialogRef = useRef<IDialogActions | null>(null);
    const refinementDialogRef = useRef<IDialogActions | null>(null);

    const {user} = useAuth();
    const engine = permissionEngine((user?.accessControl ?? []) as IAccessControl[]);
    const canPost = engine.can("ordini - ordini clienti", 'post');

    return (
        <Box sx={{p: 0}}>
            <DyeFormDialog ref={dyeDialogRef} order_row_id={selectedOrderRowId as number}/>
            <RefinementFormDialog ref={refinementDialogRef} order_row_id={selectedOrderRowId as number}/>

            <GenericForm<IOrderRowForm, IOrderRow, IOrderRowsStoreState>
                resource="ordini - ordini clienti"
                onSuccess={handlePanelSuccess}
                dialogMode
                floatingPanelMode
                floatingPanelUUID={floatingPanelUUID}
                selectedId={selectedOrderRowId}
                entity={orderRow}
                emptyValues={{
                    measurement_unit_id: measurementUnits.find(x => x.name === "Metri quadrati")?.id || null,
                    currency_id: currencies.find((x) => x.abbreviation === 'EUR')?.id ?? null,
                    processed: false,
                    cancelled: false,
                    weight: null,
                    quantity: null,
                    // price: null,
                    // total_price: null,
                    currency_price: null,
                    currency_exchange: 1,
                    // total_currency_price: null,
                    agent_percentage_row: null,
                    // tolerance_quantity_percentage: 40,
                    shipment_schedule: null,
                    production_schedule: null,
                    // delivery_date_request: null,
                    delivery_date_confirmed: null,
                    article_id: null,
                    client_order_id: clientOrderId ?? 0,
                    selection_id: null,
                }}
                mapEntityToForm={(x) => ({
                    measurement_unit_id: x.measurement_unit.id,
                    currency_id: x.currency?.id ?? null,
                    processed: x.processed,
                    cancelled: x.cancelled,
                    weight: x.weight,
                    quantity: x.quantity,
                    // price: x.price,
                    // total_price: x.total_price,
                    currency_price: x.currency_price,
                    currency_exchange: x.currency_exchange,
                    // total_currency_price: x.total_currency_price,
                    agent_percentage_row: x.agent_percentage_row,
                    // tolerance_quantity_percentage: x.tolerance_quantity_percentage,
                    shipment_schedule: x.shipment_schedule,
                    production_schedule: x.production_schedule,
                    // delivery_date_request: x.delivery_date_request,
                    delivery_date_confirmed: x.delivery_date_confirmed,
                    article_id: x.article.id,
                    client_order_id: clientOrderId ?? 0,
                    selection_id: x.selection?.id ?? null,
                })}
                create={(payload) => createRow({
                    ...payload,
                    article_id: payload.article_id as number,
                    measurement_unit_id: payload.measurement_unit_id as number,
                    client_order_id: clientOrderId as number
                })}
                update={(id, payload) => updateRow({
                    id,
                    payload: {
                        ...payload,
                        article_id: payload.article_id as number,
                        measurement_unit_id: payload.measurement_unit_id as number,
                        client_order_id: clientOrderId as number
                    }
                })}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedOrderRowId: null})}
                validateBeforeSave={(v) => !!v.article_id && !!v.measurement_unit_id && !!v.quantity}
                extraButtons={[
                    <CustomButton
                        key="dye"
                        label={t("orders.row.dye")}
                        color={"primary"}
                        icon={<ColorLensIcon/>}
                        onClick={() => openDialog(dyeDialogRef)}
                        isEnable={!!selectedOrderRowId && canPost}
                    />,
                    <CustomButton
                        key="refinement"
                        label={t("orders.row.refinement")}
                        color={"success"}
                        icon={<SettingsInputHdmiIcon/>}
                        onClick={() => openDialog(refinementDialogRef)}
                        isEnable={!!selectedOrderRowId && canPost}
                    />,
                ]}
                renderFields={() => (
                    <OrderRowFormFields
                        clientOrderId={clientOrderId as number}
                        selectedOrderRowId={selectedOrderRowId as number}
                    />
                )}
            />
        </Box>
    );
};

interface OrderRowFormFieldsProps {
    clientOrderId?: number;
    selectedOrderRowId?: number;
}

const OrderRowFormFields = ({clientOrderId, selectedOrderRowId}: OrderRowFormFieldsProps) => {
    const {t} = useTranslation(["form"]);

    const {data: orderRow} = orderRowApi.useGetDetail(selectedOrderRowId);
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: currencies = []} = currencyApi.useGetList();
    const {data: order} = customerOrderApi.useGetDetail(clientOrderId);
    const {data: articles = []} = articleApi.useGetList({queryParams: {client: order?.client.id as number}});
    const {data: selections = []} = selectionApi.useGetList();

    const currencyOptions = useMemo(() =>
            currencies.map(c => ({value: c.id, label: `${c.abbreviation} - ${c.name}`})),
        [currencies]);

    const addExchangeDialogRef = useRef<IDialogActions | null>(null);

    const isEuro = (currencyId: number | null) => (
        currencyId === currencies.find(c => c.abbreviation === 'EUR')?.id
    )

    const watchedCurrencyId = useWatch<IOrderRowForm>({name: "currency_id"});
    const watchedCurrencyValue = useWatch<IOrderRowForm>({name: "currency_exchange"});

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IOrderRowForm>({
        formKey: "article_id",
        dependencyKey: "articles"
    })
    useSubscribePanel<IOrderRowForm>({
        formKey: "selection_id",
        dependencyKey: "selection"
    })

    const {setValue} = useFormContext<IOrderRowForm>();

    return (
        <Stack gap={1}>
            <CurrencyWatcher
                currencies={currencies}
                exchangeFieldName={"currency_exchange"}
            />
            <CurrenciesExchangeFormDialog
                ref={addExchangeDialogRef}
                currencyId={watchedCurrencyId as number}
                currencyValue={watchedCurrencyValue as number > 0
                    ? watchedCurrencyValue as number
                    : null
                }
                onChangeValue={(value) => {setValue('currency_exchange', value)}}
            />

            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                <SelectFieldControlled<IOrderRowForm>
                    name="article_id"
                    label={t("orders.row.article")}
                    options={articles?.map(p => ({value: p.id, label: `${p.code} - ${p.name}`})) || []}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            extra: {
                                clientId: order?.client.id as number,
                            },
                            initialValue: input,
                            menu: {
                                component: "articles",
                                i18nKey: "menu.products.articles"
                            }
                        })
                    }}
                />
                <FlagCheckBoxFieldControlled<IOrderRowForm>
                    name="processed"
                    label={t("orders.row.processed")}
                    disabled
                />
                <FlagCheckBoxFieldControlled<IOrderRowForm>
                    name="cancelled"
                    label={t("orders.row.cancelled")}
                    disabled
                />
            </Box>

            <SelectFieldControlled<IOrderRowForm>
                name={"selection_id"}
                label={t("orders.row.selection")}
                options={selections?.map(s => ({value: s.id, label: s.name})) || []}
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "selection",
                            i18nKey: "menu.products.selection"
                        }
                    })
                }}
            />

            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IOrderRowForm>
                    name="measurement_unit_id"
                    label={t("orders.row.measurement_unit")}
                    options={measurementUnits?.map(mu => ({value: mu.id, label: mu.name})) || []}
                    required
                />
                <NumberFieldControlled<IOrderRowForm>
                    name="quantity"
                    label={t("orders.row.quantity")}
                    required
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1, mb: 1.5}}>
                <DateFieldControlled<IOrderRowForm>
                    name="delivery_date_confirmed"
                    label={t("orders.row.delivery_date_confirmed")}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IOrderRowForm>
                    name="currency_id"
                    label={t("orders.row.currency")}
                    options={currencyOptions}
                />
                <NumberFieldControlled<IOrderRowForm>
                    name="currency_price"
                    label={t("orders.row.currency_price")}
                />
                <TextFieldValue
                    label={t("orders.row.total_currency_price")}
                    value={orderRow?.total_currency_price ?? undefined}
                    isFilled={!!orderRow}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <NumberFieldControlled<IOrderRowForm>
                    name="currency_exchange"
                    label={t("orders.row.currency_exchange")}
                    precision={4}
                    deactivated
                />
                <Box sx={{mb: 1}}>
                    <NewButton
                        sx={{px: 0.5, maxHeight: 32}}
                        onClick={() => openDialog(addExchangeDialogRef)}
                        isEnable={!isEuro(watchedCurrencyId as number)}
                        disableLabel
                    />
                </Box>
                <TextFieldValue
                    label={t("orders.row.price")}
                    value={orderRow?.price ?? undefined}
                    isFilled={!!orderRow}
                />
                <TextFieldValue
                    label={t("orders.row.total_price")}
                    value={orderRow?.total_price ?? undefined}
                    isFilled={!!orderRow}
                />
            </Box>
        </Stack>
    )
}

export default OrderRowsForm;

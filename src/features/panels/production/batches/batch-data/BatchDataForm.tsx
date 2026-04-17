import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import TextFieldValue from "@ui/form/controlled/TextFieldValue";
import {Divider, Stack, Typography} from "@mui/material";
import type {IBatchData} from "@features/panels/production/batches/batch-data/api/IBatchData";
import {batchDataApi} from "@features/panels/production/batches/batch-data/api/batchDataApi";
import BatchDataCostsList from "@features/panels/production/batches/batch-data/BatchDataCostsList";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import type {
    IBatchDataStoreParams,
} from "@features/panels/production/batches/batch-data/BatchDataPanel";
import {seaPortApi} from "@features/panels/contacts/seaports/api/seaPortApi";
import {palletApi} from "@features/panels/warehouse/pallets/api/palletApi";
import {shipmentConditionApi} from "@features/panels/commercial/shipment-conditions/api/shipmentConditionApi";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export interface IBatchDataForm {
    delivery_date: string | null;
    currency_exchange: number | null;
    payment_date: string | null;
    sea_port_date: string | null;
    declared_gross_weight: number | null;
    declared_net_weight: number | null;
    declared_average_weight: number | null;
    founded_gross_weight: number | null;
    founded_net_weight: number | null;
    founded_average_weight: number | null;
    container_code: string | null;
    shipping_cost: number | null;
    pallet_number: string | null;
    pallet_weight: number | null;
    pallet_id: number | null;
    sea_port_id: number | null;
    shipment_condition_id: number | null;
    shipment_subcontractor_id: number | null;
    amount: number | null;
    currency_id: number | null;
}

const BatchDataFields = ({batchData}: {
    batchData: IBatchData
}) => {
    const {t} = useTranslation(["form", "common"]);

    const {data: seaPorts = []} = seaPortApi.useGetList();
    const {data: pallets = []} = palletApi.useGetList();
    const {data: shipmentConditions = []} = shipmentConditionApi.useGetList();
    const {data: contacts = []} = contactsApi.useGetList({queryParams: {type: "supplier"}});
    const {data: currencies = []} = currencyApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IBatchDataForm>({
        formKey: "shipment_subcontractor_id",
        dependencyKey: "contacts"
    })

    return (
        <Stack spacing={1.5}>
            <Stack direction="row" spacing={2}>
                <TextFieldValue
                    label={t("production.batch.batch-data.batch_code")}
                    value={batchData?.batch?.batch_code}
                />
                <TextFieldValue
                    label={t("production.batch.batch-data.leather")}
                    value={batchData?.batch?.leather?.name}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <TextFieldValue
                    label={t("production.batch.batch-data.amount")}
                    value={batchData?.batch?.pieces}
                />
                <TextFieldValue
                    label={t("production.batch.batch-data.quantity")}
                    value={batchData?.batch?.quantity}
                    startAdornment={batchData?.batch?.measurement_unit.prefix}
                />
                <DateFieldControlled<IBatchDataForm>
                    name="delivery_date"
                    label={t("production.batch.batch-data.delivery_date")}
                />
            </Stack>

            <Divider />
            <Typography variant="h6" sx={{pt: 0, mt: 0}}>{t("production.batch.batch-data.weights")}</Typography>

            <Stack direction="row" spacing={2} sx={{pb: -10}}>
                <NumberFieldControlled<IBatchDataForm>
                    name="pallet_number"
                    label={t("production.batch.batch-data.pallet_number")}
                    precision={0}
                />
                <SelectFieldControlled<IBatchDataForm>
                    name="pallet_id"
                    label={t("production.batch.batch-data.pallet")}
                    options={pallets.map(p => ({value: p.id, label: p.name}))}
                    showRequired={false}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="pallet_weight"
                    label={t("production.batch.batch-data.pallet_weight")}
                    deactivated
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <NumberFieldControlled<IBatchDataForm>
                    name="declared_gross_weight"
                    label={t("production.batch.batch-data.gross_weight")}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="declared_net_weight"
                    label={t("production.batch.batch-data.net_weight")}
                    deactivated
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="declared_average_weight"
                    label={t("production.batch.batch-data.average_weight")}
                    deactivated
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <NumberFieldControlled<IBatchDataForm>
                    name="founded_gross_weight"
                    label={t("production.batch.batch-data.founded_gross_weight")}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="founded_net_weight"
                    label={t("production.batch.batch-data.founded_net_weight")}
                    deactivated
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="founded_average_weight"
                    label={t("production.batch.batch-data.founded_average_weight")}
                    deactivated
                />
            </Stack>

            <Divider />
            <Typography variant="h6">{t("production.batch.batch-data.payment_and_delivery")}</Typography>

            <Stack direction="row" spacing={2}>
                <DateFieldControlled<IBatchDataForm>
                    name="payment_date"
                    label={t("production.batch.batch-data.payment_date")}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name={"amount"}
                    label={t("production.batch.batch-data.amount-currency")}
                    required
                    rules={{
                        validate: (value) => value !== 0 || t("common:form.error.not-zero")
                    }}
                />
                <SelectFieldControlled<IBatchDataForm>
                    name={"currency_id"}
                    label={t("production.batch.batch-data.currency")}
                    options={currencies.map(c => ({value: c.id, label: `${c.abbreviation} (${c.name})`}))}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="currency_exchange"
                    label={t("production.batch.batch-data.exchange_rate")}
                    precision={4}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <SelectFieldControlled<IBatchDataForm>
                    name="shipment_subcontractor_id"
                    label={t("production.batch.batch-data.carrier")}
                    options={contacts.map(c => ({value: c.id, label: c.name}))}
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            extra: {
                                supplier: true
                            },
                            initialValue: input,
                            menu: {
                                component: "contacts",
                                i18nKey: "menu.contacts.contacts"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<IBatchDataForm>
                    name="shipment_condition_id"
                    label={t("production.batch.batch-data.shipment_condition")}
                    options={shipmentConditions.map(s => ({value: s.id, label: s.name}))}
                />
            </Stack>

            <Divider />
            <Typography variant="h6">{t("production.batch.batch-data.port")}</Typography>

            <Stack direction="row" spacing={2}>
                <DateFieldControlled<IBatchDataForm>
                    name="sea_port_date"
                    label={t("production.batch.batch-data.sea_port_date")}
                />
                <TextFieldControlled<IBatchDataForm>
                    name="container_code"
                    label={t("production.batch.batch-data.container_code")}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <SelectFieldControlled<IBatchDataForm>
                    name="sea_port_id"
                    label={t("production.batch.batch-data.sea_port")}
                    options={seaPorts.map(s => ({value: s.id, label: s.name}))}
                />
                <NumberFieldControlled<IBatchDataForm>
                    name="shipping_cost"
                    label={t("production.batch.batch-data.shipping_cost")}
                />
            </Stack>

            <Divider />
            <Typography variant="h6">{t("production.batch.batch-data.costs")}</Typography>
            <BatchDataCostsList batchId={batchData?.batch?.id} />
        </Stack>
    );
};

const BatchDataForm = ({
                           extra
                       }: ICustomPanelFormProps<IBatchDataStoreParams>) => {
    const {useGetDetail, usePut} = batchDataApi;
    const {data: batchData} = useGetDetail(extra?.batchDataId);

    const {mutateAsync: update, isPending: isUpdating} = usePut();

    return (
        <GenericForm<IBatchDataForm, IBatchData>
            resource="produzione - lotti"
            dialogMode
            floatingPanelMode
            floatingPanelUUID={"batch-data-form"}
            selectedId={extra?.batchDataId}
            entity={batchData}
            disableDeleteButton
            closePanelOnSave={false}
            isSaving={isUpdating}
            emptyValues={{
                amount: null,
                delivery_date: null,
                currency_exchange: null,
                payment_date: null,
                sea_port_date: null,
                declared_gross_weight: null,
                declared_net_weight: null,
                declared_average_weight: null,
                founded_gross_weight: null,
                founded_net_weight: null,
                founded_average_weight: null,
                container_code: null,
                shipping_cost: null,
                pallet_number: null,
                pallet_weight: null,
                pallet_id: null,
                sea_port_id: null,
                shipment_condition_id: null,
                shipment_subcontractor_id: null,
                currency_id: null,
            }}
            mapEntityToForm={(entity: IBatchData): IBatchDataForm => ({
                amount: entity.amount,
                delivery_date: entity.delivery_date,
                currency_exchange: entity.currency_exchange,
                payment_date: entity.payment_date,
                sea_port_date: entity.sea_port_date,
                declared_gross_weight: entity.declared_gross_weight,
                declared_net_weight: entity.declared_net_weight,
                declared_average_weight: entity.declared_average_weight,
                founded_gross_weight: entity.founded_gross_weight,
                founded_net_weight: entity.founded_net_weight,
                founded_average_weight: entity.founded_average_weight,
                container_code: entity.container_code,
                shipping_cost: entity.shipping_cost,
                pallet_number: entity.pallet_number,
                pallet_weight: entity.pallet_weight,
                pallet_id: entity.pallet?.id ?? null,
                sea_port_id: entity.sea_port?.id ?? null,
                shipment_condition_id: entity.shipment_condition?.id ?? null,
                shipment_subcontractor_id: entity.shipment_subcontractor?.id ?? null,
                currency_id: entity.currency?.id ?? null,
            })}
            update={(id, payload) => update({id, payload})}
            renderFields={() => <BatchDataFields batchData={batchData as IBatchData}/>}
        />
    );
};

export default BatchDataForm;
import {useFormContext, useWatch} from "react-hook-form";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import {Box} from "@mui/material";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {paymentApi} from "@features/panels/shared/api/payment/paymentApi.ts";
import {useEffect} from "react";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IPayment} from "@features/panels/shared/api/payment/IPayment.ts";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {
    customerOrderApi,
    type ICustomerOrderPayload
} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import dayjs from "dayjs";
import type {
    IShipmentCondition
} from "@features/panels/orders/customer-orders/api/shipment-condition/IShipmentCondition.ts";
import {
    shipmentConditionApi
} from "@features/panels/orders/customer-orders/api/shipment-condition/shipmentConditionApi.ts";

export type ICustomerOrderForm = Omit<ICustomerOrder, "id"
    | "client"
    | "check_user"
    | "payment"
    | "shipment_condition"
    | "address"
> & {
    client_id: number | null;
    payment_id?: number | null;
    agent_id?: number | null;
    shipment_condition_id?: number | null;
    address_id?: number | null;
};

const FormFields = ({clients, payments, shipmentConditions, order, selectedCustomerOrderId}: {
    clients: IContact[],
    payments: IPayment[],
    shipmentConditions: IShipmentCondition[],
    order?: ICustomerOrder | null,
    selectedCustomerOrderId: number | null | undefined
}) => {
    const {t} = useTranslation(["form"]);
    
    const {setValue, control} = useFormContext<ICustomerOrderForm>();

    const clientId = useWatch({
        control,
        name: 'client_id'
    });

    const selectedClient = clients.find(c => c.id === clientId);

    const {data: clientDetail} = contactsApi.useGetDetail(clientId);
    const clientAddresses = clientDetail?.contact_addresses || [];

    const agentOptions = (clientDetail || selectedClient)?.contact_agents?.map(ca => ({
        value: ca.agent.id,
        label: ca.agent.name
    })) ?? [];

    useEffect(() => {
        if (clientId && !selectedCustomerOrderId && clientDetail) {
            if (clientDetail.contact_agents && clientDetail.contact_agents.length > 0) {
                const currentAgentId = control._formValues.agent_id;
                const isAgentInContactAgents = clientDetail.contact_agents.some(ca => ca.agent.id === currentAgentId);
                if (!isAgentInContactAgents) {
                    setValue('agent_id', clientDetail.contact_agents[0].agent.id);
                }
            } else {
                setValue('agent_id', undefined);
            }

            if (clientDetail.payment) {
                setValue('payment_id', clientDetail.payment.id);
            }
            if (clientDetail.shipment_condition) {
                setValue('shipment_condition_id', clientDetail.shipment_condition.id);
            }
        }
    }, [clientId, clientDetail, setValue, control, selectedCustomerOrderId]);

    const filterAddressString = ({addressLabels}: { addressLabels: (string | null | undefined)[] }) => {
        return addressLabels
            .filter((label): label is string => !!label && label.trim().length > 0)
            .join(', ');
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={t("orders.order_number")}
                    value={order?.order_number}
                    isFilled={!!selectedCustomerOrderId}
                />
                <DateFieldControlled<ICustomerOrderForm>
                    label={t("orders.order_date")}
                    name={"order_date"}
                    required
                />
                <Box sx={{display: 'flex', flexDirection: 'row', ml: 1.5}}>
                    <FlagCheckBoxFieldControlled<ICustomerOrderForm>
                        name={"cancelled"}
                        label={t("orders.cancelled")}
                        width={100}
                        disabled
                    />
                    <FlagCheckBoxFieldControlled<ICustomerOrderForm>
                        name={"processed"}
                        label={t("orders.processed")}
                        width={81}
                        disabled
                    />
                    <FlagCheckBoxFieldControlled<ICustomerOrderForm>
                        name={"checked"}
                        label={t("orders.checked")}
                        width={110}
                        disabled
                    />
                </Box>
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"client_id"}
                    label={t("orders.client")}
                    options={clients.map(c => ({value: c.id, label: c.name}))}
                    required
                />
                <TextFieldControlled<ICustomerOrderForm>
                    label={t("orders.client_order_number")}
                    name={"client_order_number"}
                    required
                />
                <DateFieldControlled<ICustomerOrderForm>
                    label={t("orders.client_order_date")}
                    name={"client_order_date"}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"agent_id"}
                    label={t("orders.agent")}
                    options={agentOptions}
                />
                <TextFieldControlled<ICustomerOrderForm>
                    label={t("orders.agent_order_number")}
                    name={"agent_order_number"}
                />
                <DateFieldControlled<ICustomerOrderForm>
                    label={t("orders.agent_order_date")}
                    name={"agent_order_date"}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                {/*
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"client_id"} // TODO: Change to contact_f_id if available
                    label={"Clt F"}
                    options={contacts.map(c => ({id: c.id, label: c.name}))}
                    sx={{flexGrow: 1}}
                />
                */}
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"payment_id"}
                    label={t("orders.payment")}
                    options={payments.map(p => ({value: p.id, label: p.name}))}
                    required
                />
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"shipment_condition_id"}
                    label={t("orders.shipment-condition")}
                    options={shipmentConditions.map(p => ({value: p.id, label: p.name}))}
                />
            </Box>

            <SelectFieldControlled<ICustomerOrderForm>
                name={"address_id"}
                label={t("orders.destination")}
                options={clientAddresses.map(p => ({
                    value: p.id,
                    label: `${p.address_name} - ${filterAddressString({addressLabels: [p.address, p.address_2, p.address_3, p.address_4]})} - ${p.town.name} - ${p.nation.name}`
                }))}
            />

            {/*
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mb: 1}}>
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"client_id"} // TODO: Change to yield_id if available
                    label={t("orders.yield")}
                    options={[]}
                />
                <SelectFieldControlled<ICustomerOrderForm>
                    name={"client_id"} // TODO: Change to shipment_id if available
                    label={t("orders.shipment")}
                    options={[]}
                />
            </Box>
            */}

            {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center'}}>*/}
            {/*    /!* <Typography sx={{minWidth: 50}}>{t("orders.destination")}</Typography> *!/*/}
            {/*    /!**/}
            {/*    <Box sx={{flexGrow: 1, border: '1px solid #ccc', height: 32, display: 'flex', alignItems: 'center', px: 1, bgcolor: '#f5f5f5'}}>*/}
            {/*         Placeholder for destination*/}
            {/*    </Box>*/}
            {/*    <IconButton size="small"><ClearIcon fontSize="small"/></IconButton>*/}
            {/*    *!/*/}
            {/*    <NumberFieldControlled<ICustomerOrderForm>*/}
            {/*        name={"percentage_tolerance_quantity"}*/}
            {/*        label={t("orders.percentage_tolerance_quantity")}*/}
            {/*        startAdornment="%"*/}
            {/*    />*/}
            {/*    <IconButton size="small"><ChevronRightIcon fontSize="small"/></IconButton>*/}
            {/*</Box>*/}

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<ICustomerOrderForm>
                    name={"order_note"}
                    label={t("orders.order_note")}
                    TextFieldProps={{multiline: true, rows: 2}}
                />
                <TextFieldControlled<ICustomerOrderForm>
                    name={"order_note_production"}
                    label={t("orders.order_note_production")}
                    TextFieldProps={{multiline: true, rows: 2}}
                />
                <TextFieldControlled<ICustomerOrderForm>
                    name={"order_note_administration"}
                    label={t("orders.order_note_administration")}
                    TextFieldProps={{multiline: true, rows: 2}}
                />
                {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center'}}>*/}
                {/*    <TextFieldControlled<ICustomerOrderForm>*/}
                {/*        name={"order_note_iso"}*/}
                {/*        label={t("orders.order_note_iso")}*/}
                {/*    />*/}
                {/*</Box>*/}
            </Box>
        </>
    );
}

const CustomerOrdersForm = () => {
    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore(state => state.uiState.selectedCustomerOrderId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = customerOrderApi;
    const {data: order} = useGetDetail(selectedCustomerOrderId);
    const {mutateAsync: createOrder, isPending: isPosting} = usePost();
    const {mutateAsync: updateOrder, isPending: isPutting} = usePut();
    const {mutateAsync: deleteOrder, isPending: isDeleting} = useDelete();

    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: 'client'}});
    const {data: payments = []} = paymentApi.useGetList();
    const {data: shipmentConditions = []} = shipmentConditionApi.useGetList();

    return (
        <GenericForm<ICustomerOrderForm, ICustomerOrder, ICustomerOrdersStoreState>
            selectedId={selectedCustomerOrderId}
            entity={order}
            emptyValues={{
                client_id: null,
                agent_id: null,
                address_id: null,
                shipment_condition_id: null,
                payment_id: null,
                processed: false,
                cancelled: false,
                checked: false,
                percentage_agent: 0,
                // percentage_tolerance_quantity: 40,
                order_note: "",
                order_note_iso: "",
                order_note_production: "",
                order_note_administration: "",
                printed: false,
                print_date: "",
                check_date: "",
                order_date: dayjs(Date.now()).format('YYYY-MM-DD'),
                client_order_number: "",
                client_order_date: "",
                agent_order_number: "",
                agent_order_date: "",
            } as ICustomerOrderForm}
            mapEntityToForm={(x) => ({
                client_id: x.client?.id || null,
                agent_id: x.agent?.id || null,
                address_id: x.address?.id || null,
                shipment_condition_id: x.shipment_condition?.id || null,
                payment_id: x.payment?.id || null,
                processed: x.processed,
                cancelled: x.cancelled,
                checked: x.checked,
                percentage_agent: x.percentage_agent,
                // percentage_tolerance_quantity: x.percentage_tolerance_quantity ?? 40,
                order_note: x.order_note,
                order_note_iso: x.order_note_iso,
                order_note_production: x.order_note_production,
                order_note_administration: x.order_note_administration,
                printed: x.printed,
                print_date: x.print_date,
                check_date: x.check_date,
                order_date: x.order_date,
                client_order_number: x.client_order_number,
                client_order_date: x.client_order_date,
                agent_order_number: x.agent_order_number,
                agent_order_date: x.agent_order_date,
            } as ICustomerOrderForm)}
            create={(payload) => createOrder(payload as ICustomerOrderPayload)}
            onCreateSuccess={(id) => setUIState({selectedCustomerOrderId: id})}
            update={(id, payload) => updateOrder({id, payload: payload as ICustomerOrderPayload})}
            remove={(id) => deleteOrder(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedCustomerOrderId: null})}
            validateBeforeSave={(v) => !!v.client_id && !!v.payment_id && !!v.order_date && !!v.client_order_number}
            renderFields={() => (
                <FormFields
                    clients={clients}
                    payments={payments}
                    shipmentConditions={shipmentConditions}
                    order={order as ICustomerOrder}
                    selectedCustomerOrderId={selectedCustomerOrderId}
                />
            )}
        />
    )
}

export default CustomerOrdersForm;

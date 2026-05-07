import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo} from "react";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import useCallablePanel from "@ui/panel/useCallablePanel";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {Typography} from "@mui/material";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';

const ContactsDetailList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedDetailId = useStore(state => state.uiState.selectedDetailId);
    const setUIState = useStore(state => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactDetail>[]>(() => [
        {
            accessorKey: "detail_type.code",
            header: t("form:contacts.details.types.code"),
        },
        {
            accessorKey: "detail_type.name",
            header: t("form:contacts.details.types.type"),
        },
        {
            accessorKey: "name",
            header: t("form:contacts.details.value"),
            Cell: ({row}) => (
                <Typography sx={{textTransform: "lowercase"}}>{row.original.name}</Typography>
            )
        },
        {
            accessorKey: "note",
            header: t("form:contacts.details.note")
        }
    ], [t]);

    const handleOpenCreateDialog = () => {
        setUIState({selectedDetailId: null});
        addSelectPanel({
            initialValue: '',
            extra: {
                contact_id: selectedContactId,
                panelId: "createContactDetail"
            },
            menu: {
                component: "contactsDetail",
                i18nKey: "menu.contacts.add-detail"
            },
            customId: "createContactDetail"
        });
    }

    const handleOpenUpdateDialog = (id: number) => {
        addSelectPanel({
            initialValue: '',
            extra: {
                contact_id: selectedContactId,
                detail_id: id,
                panelId: "updateContactDetail:" + id
            },
            menu: {
                component: "contactsDetail",
                i18nKey: "menu.contacts.add-detail"
            },
            customId: "updateContactDetail:" + id
        });
    }

    return (
        <GenericList<IContactDetail>
                disableBorder
                data={contact?.contact_details || []}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedDetailId}
                onRowSelect={(id) => setUIState({selectedDetailId: id})}
                onRowDoubleClick={() => handleOpenUpdateDialog(selectedDetailId as number)}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar:
                        <ListToolbar
                            label={<Typography variant="h6">{t("contacts.details.list")}</Typography>}
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.details-add-btn")}
                                    color={"primary"}
                                    icon={<AddIcCallIcon/>}
                                    onClick={() => handleOpenCreateDialog()}
                                />
                            ]}
                        />
                }}
            />
    )
}

export default ContactsDetailList;
import GenericList from "@features/panels/shared/GenericList";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import ContactsAddressFormDialog from "@features/panels/contacts/contacts/address/ContactsAddressFormDialog";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import {openDialog} from "@ui/dialog/dialogHelper";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {Box, Typography} from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

const ContactsAddressList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactAddress>[]>(() => [
        {
            accessorKey: "address_name",
            header: t("contacts.address.name")
        },
        {
            accessorKey: "address",
            header: t("contacts.address.address"),
            Cell: ({row}) => (
                <Box>
                    <Typography>{row.original.address || ""}</Typography>
                    <Typography>{row.original.address_2 || ""}</Typography>
                    <Typography>{row.original.address_3 || ""}</Typography>
                    <Typography>{row.original.address_4 || ""}</Typography>
                </Box>
            )
        },
        {
            accessorKey: "zip_code",
            header: t("cap.code")
        },
        // {
        //     accessorKey: "town.name",
        //     header: t("cap.name")
        // },
        {
            accessorKey: "nation.name",
            header: t("nations.name")
        },
    ], [t]);

    const editDialogRef = useRef<IDialogActions | null>(null);

    const handleOpenCreateDialog = () => {
        setUIState({selectedAddressId: null});
        openDialog(editDialogRef);
    }

    return (
        <>
            <ContactsAddressFormDialog ref={editDialogRef}/>

            <GenericList<IContactAddress>
                disableBorder
                data={contact?.contact_addresses || []}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedAddressId}
                onRowSelect={(id) => setUIState({selectedAddressId: id})}
                onRowDoubleClick={() => openDialog(editDialogRef)}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar:
                        <ListToolbar
                            label={<Typography variant="h6">{t("contacts.address.list")}</Typography>}
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.addresses-add-btn")}
                                    color={"primary"}
                                    icon={<PostAddIcon/>}
                                    onClick={() => handleOpenCreateDialog()}
                                />
                            ]}
                        />
                }}
            />
        </>
    )
}

export default ContactsAddressList;
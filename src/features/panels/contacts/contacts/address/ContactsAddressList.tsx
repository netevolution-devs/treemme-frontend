import GenericList from "@features/panels/shared/GenericList";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {contactsAddressApi} from "@features/panels/contacts/contacts/api/contacts-address/contactsAddressApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import useCallablePanel from "@ui/panel/useCallablePanel";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {Box, Checkbox, CircularProgress, Typography} from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';

const ContactsAddressList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {usePut} = contactsAddressApi;
    const {
        mutateAsync: updateAddress,
        isPending
    } = usePut({invalidateQueries: ['CONTACT', 'CONTACT_ADDRESS', 'DETAIL', 'ADDRESS', String(selectedContactId)]});

    const {
        data: contactAddresses = [],
        isLoading,
        isFetching
    } = contactsApi.useGetContactAddressDetail(selectedContactId as number);

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
        {
            header: "Destinazione diversa",
            Cell: ({row}) => row.original.different_destination ? row.original.contact.name : "",
        },
        {
            accessorKey: "default_address",
            header: t("contacts.address.default"),
            size: 100,
            Cell: ({row}) => (
                <>
                    <Box sx={{minHeight: 45, display: "flex", alignItems: "center"}}>
                        {((isPending || isFetching) && row.original.id === selectedAddressId) ? (
                            <>
                                <CircularProgress size={20} color={"secondary"} sx={{ml: 1.2}}/>
                            </>
                        ) : (
                            <Checkbox
                                color={"secondary"}
                                checked={row.original.default_address}
                                onClick={(e) => e.stopPropagation()}
                                onChange={async (e) => {
                                    setUIState({selectedAddressId: row.original.id});
                                    await updateAddress({
                                        id: row.original.id,
                                        payload: {
                                            default_address: e.target.checked
                                        }
                                    })
                                }}
                            />
                        )}
                    </Box>
                </>
            )
        }
    ], [t, selectedContactId, updateAddress, isPending, isFetching]);

    const handleOpenCreateDialog = (associateContact: boolean) => {
        setUIState({selectedAddressId: null});
        addSelectPanel({
            initialValue: '',
            extra: {
                contact_id: selectedContactId,
                panelId: "createContactAddress",
                associateContact
            },
            menu: {
                component: "contactsAddress",
                i18nKey: "menu.contacts.add-address"
            },
            customId: "createContactAddress"
        });
    }

    const handleOpenUpdateDialog = (id: number) => {
        const addr = contactAddresses.find(x => (x.id === id && !!x.different_destination));

        addSelectPanel({
            initialValue: '',
            extra: {
                contact_id: selectedContactId,
                address_id: id,
                panelId: "updateContactAddress:" + id,
                ddAddr: addr,
            },
            menu: {
                component: "contactsAddress",
                i18nKey: "menu.contacts.add-address"
            },
            customId: "updateContactAddress:" + id
        });
    }

    return (
        <GenericList<IContactAddress>
            disableBorder
            data={contactAddresses}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedAddressId}
            onRowSelect={(id) => setUIState({selectedAddressId: id})}
            onRowDoubleClick={() => handleOpenUpdateDialog(selectedAddressId as number)}
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
                                onClick={() => handleOpenCreateDialog(false)}
                            />,
                            <CustomButton
                                isEnable={!!selectedContactId}
                                label={t("contacts.addresses-add-btn-existing")}
                                color={"primary"}
                                icon={<FormatListBulletedAddIcon/>}
                                onClick={() => handleOpenCreateDialog(true)}
                            />
                        ]}
                    />
            }}
        />
    )
}

export default ContactsAddressList;
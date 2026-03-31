import {useTranslation} from "react-i18next";
import type {IUserManagement, IUserManagementPayload} from "@features/panels/user-management/api/IUserManagement.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import {userManagementApi} from "@features/panels/user-management/api/userManagementApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import UserGroupAssignment from "@features/panels/user-management/UserGroupAssignment.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {Box, Button, Tooltip} from "@mui/material";
import EmailField from "@ui/form/controlled/EmailField.tsx";
import PasswordField from "@ui/form/controlled/PasswordField.tsx";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {useFormContext} from "react-hook-form";
import dayjs from "dayjs";

export type IUserForm = Omit<IUserManagement, "id" | "group_users"> & IUserManagementPayload;

const PasswordGenerator = () => {
    const {t} = useTranslation(["form"]);
    const {setValue} = useFormContext<IUserForm>();

    const handleGeneratePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setValue('password', password);
    };

    return (
        <Tooltip
            arrow
            title={t("form:user.create.rules.password.tooltip") || ""}
            placement="top"
            slotProps={{
                popper: {
                    modifiers: [{
                        name: "offset",
                        options: {
                            offset: [0, -5]
                        }
                    }]
                }
            }}
        >
            <Button
                sx={{p: 0.5, minWidth: 50}}
                size={"small"}
                variant="outlined"
                onClick={() => handleGeneratePassword()}
            >
                <VpnKeyIcon/>
            </Button>
        </Tooltip>
    );
};

const UserManagementForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedUserId = useStore(state => state.uiState.selectedUserId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = userManagementApi;
    const {data: user} = useGetDetail(selectedUserId);
    const {mutateAsync: createUser, isPending: isPosting} = usePost();
    const {mutateAsync: updateUser, isPending: isPutting} = usePut();
    const {mutateAsync: deleteUser, isPending: isDeleting} = useDelete();

    return (
        <>
        <GenericForm<IUserForm, IUserManagement, IUserManagementStoreState>
            selectedId={selectedUserId}
            entity={user}
            emptyValues={{email: '', password: '', last_access: "", user_code: ""}}
            mapEntityToForm={(u) => ({
                email: u.email,
                password: '',
                user_code: u.user_code,
                last_access: u.last_access ? dayjs(u.last_access).format("DD/MM/YYYY HH:mm") : ""
            })}
            create={(payload) => createUser(payload)}
            update={(id, payload) => updateUser({id, payload})}
            remove={(id) => deleteUser(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedUserId: null})}
            validateBeforeSave={(v) => !!v.email && !!v.password}
            renderFields={() => (
                <>
                    {user && (
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mb: 2}}>
                            <TextFieldControlled<IUserForm>
                                name="user_code"
                                label={t("user_management.user_code")}
                                TextFieldProps={{
                                    disabled: true
                                }}
                            />
                            <TextFieldControlled<IUserForm>
                                name="last_access"
                                label={t("user_management.last_access")}
                                TextFieldProps={{
                                    disabled: true
                                }}
                            />
                        </Box>
                    )}
                    <EmailField<IUserForm>
                        name="email"
                        label={t("user_management.email")}
                        required
                    />
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start'}}>
                        <Box sx={{flex: 1}}>
                            <PasswordField<IUserForm>
                                name="password"
                                label={t("user_management.password")}
                                required={!selectedUserId}
                            />
                        </Box>
                        <PasswordGenerator/>
                    </Box>
                </>
            )}
        />
        {user && <UserGroupAssignment user={user} />}
        </>
    );
};

export default UserManagementForm;

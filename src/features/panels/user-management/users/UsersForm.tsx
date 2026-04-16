import {useTranslation} from "react-i18next";
import type {IUserManagement, IUserManagementPayload} from "@features/panels/user-management/users/api/IUserManagement";
import {usePanel} from "@ui/panel/PanelContext";
import type {IUsersStoreState} from "@features/panels/user-management/users/UsersPanel";
import {usersApi} from "@features/panels/user-management/users/api/usersApi";
import GenericForm from "@features/panels/shared/GenericForm";
import UserGroupAssignment from "@features/panels/user-management/permission (legacy)/UserGroupAssignment";
import {Box, Button, Tooltip} from "@mui/material";
import EmailField from "@ui/form/controlled/EmailField";
import PasswordField from "@ui/form/controlled/PasswordField";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {useFormContext} from "react-hook-form";

export type IUserForm = Omit<IUserManagement, "id" | "group_users" | "user_code" | "last_access"> & IUserManagementPayload;

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

const UsersForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IUsersStoreState>();
    const selectedUserId = useStore(state => state.uiState.selectedUserId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = usersApi;
    const {data: user} = useGetDetail(selectedUserId);
    const {mutateAsync: createUser, isPending: isPosting} = usePost();
    const {mutateAsync: updateUser, isPending: isPutting} = usePut();
    const {mutateAsync: deleteUser, isPending: isDeleting} = useDelete();

    return (
        <>
        <GenericForm<IUserForm, IUserManagement, IUsersStoreState>
            resource="sistema - utenti"
            selectedId={selectedUserId}
            entity={user}
            emptyValues={{email: '', password: ''}}
            mapEntityToForm={(u) => ({
                email: u.email,
                password: '',
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

export default UsersForm;

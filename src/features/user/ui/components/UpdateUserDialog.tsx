import {forwardRef, useEffect, type ForwardedRef} from "react";
import {FormProvider, useForm} from "react-hook-form";
import BaseDialog from "@shared/ui/dialog/BaseDialog";
import {Button, CircularProgress, DialogContent, DialogTitle, Stack, Typography, DialogActions} from "@mui/material";
import {useTranslation} from "react-i18next";
import {closeDialog} from "@shared/ui/dialog/dialogHelper";
import UserFormFields from "./UserFormFields";
import useGetUser from "../../api/useGetUser";
import usePutUser from "../../api/usePutUser";
import SaveIcon from '@mui/icons-material/Save';
import {useUpdateUserRole} from "../../api/useUpdateUserRole";
import {useQueryClient} from "@tanstack/react-query";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import type {IUserForm} from "@features/user/model/IUserForm";
import type {IApiUserPayloadUpdate} from "@features/user/model/UserInterfaces";
import type {IUserProfile} from "@features/profile/model/IUserProfile";

interface Props {
    userCode: string;
    isProfile?: boolean;
}

const UpdateUserDialog = (
    {userCode, isProfile = false}: Props,
    ref: ForwardedRef<IDialogActions>
) => {
    const {t} = useTranslation(["common", "form"]);

    const {data: user, isLoading, isFetching} = useGetUser(userCode);
    const {mutateAsync: updateUser, isPending} = usePutUser();
    const {updateUserRole} = useUpdateUserRole();

    // Removed isInitializing state to avoid setState inside effect (react-hooks/set-state-in-effect)
    const loading = isLoading || isFetching;

    const methods = useForm<IUserForm>({
        mode: "onSubmit",
        defaultValues: {}
    });

    const queryClient = useQueryClient();

    const onSubmit = async (data: IUserForm) => {
        const payload: IApiUserPayloadUpdate = {
            code: userCode,
            payload: {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                fiscal_code: data.fiscalCode as string,
                phone: data.phone as string,
                address: data.address as string,
            }
        }
        await updateUser(payload);
        await updateUserRole(user as IUserProfile, data.roles)

        if (isProfile) {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.DETAIL, user?.userCode]});
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.PROFILE]});
        }

        // Close is handled in an effect to avoid accessing refs during render via callbacks passed to react-hook-form.
    }

    const handleStatusChange = (isDialogOpen: boolean) => {
        if (isDialogOpen) {
            methods.reset();
        }
    };

    const handleClose = () => {
        methods.reset();
        closeDialog(ref);
    };

    useEffect(() => {
        if (methods.formState.isSubmitSuccessful) {
            methods.reset();
            closeDialog(ref);
        }
    }, [methods.formState.isSubmitSuccessful, methods, ref]);

    useEffect(() => {
        if (!user) return;

        methods.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            fiscalCode: user.fiscalCode,
            phone: user.phone,
            address: user.address,
            roles: user.roles.map(role => role.role)
        });
    }, [user, methods]);

    return (
        <BaseDialog ref={ref} isDialogOpen={handleStatusChange} minHeight={740}>
            {loading ? (
                <Stack sx={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </Stack>
            ) : (
                <FormProvider {...methods}>
                    <Stack
                        component="form"
                        onSubmit={methods.handleSubmit(onSubmit)}
                        autoComplete="off"
                        sx={{
                            justifyContent: "space-between",
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1
                        }}
                    >
                        <DialogTitle>{t("form:user.update.title")}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <Typography color={"textDisabled"}>{t("form:user.update.description")}</Typography>
                                <UserFormFields
                                    disablePassword
                                    disableRoleSelect={isProfile}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{px: 3, mb: 2}}>
                            <Button
                                onClick={handleClose}
                                sx={{height: 35}}
                            >
                                {t("common:button.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{px: 1, pr: 1.5, width: 180, height: 35}}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <CircularProgress
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <SaveIcon fontSize="small"
                                                  sx={{mr: 0.4}}/>{t("common:table.actions.update-user")}
                                    </>
                                )}
                            </Button>
                        </DialogActions>
                    </Stack>
                </FormProvider>
            )}
        </BaseDialog>
    )
};

export default forwardRef(UpdateUserDialog);

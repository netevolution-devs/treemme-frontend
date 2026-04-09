import type {IDialogActions} from "@shared/ui/dialog/IDialogActions";
import {forwardRef} from "react";
import {FormProvider, useForm} from "react-hook-form";
import BaseDialog from "@shared/ui/dialog/BaseDialog";
import {Button, CircularProgress, DialogContent, DialogTitle, Stack, Typography, DialogActions} from "@mui/material";
import {useTranslation} from "react-i18next";
import {closeDialog} from "@shared/ui/dialog/dialogHelper";
import type {IUserForm} from "../../model/IUserForm";
import usePostUser from "../../api/usePostUser";
import type {IApiUserPayload} from "../../model/UserInterfaces";
import UserFormFields from "./UserFormFields";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {useUpdateUserRole} from "../../api/useUpdateUserRole";

type Props = unknown;

const CreateUserDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
        const {t} = useTranslation(["common", "form"]);

        const {mutateAsync: createUser, isPending} = usePostUser();
        const {updateUserRole} = useUpdateUserRole();

        const pending = isPending;

        const methods = useForm<IUserForm>({
            mode: "onSubmit",
        });


        const onSubmit = async (data: IUserForm) => {
            const payload: IApiUserPayload = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                fiscal_code: data.fiscalCode as string,
                phone: data.phone as string,
                address: data.address as string,
                password: data.password
            }
            const response = await createUser(payload);

            await updateUserRole(response, data.roles);

            handleClose();
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

        return (
            <BaseDialog ref={ref} isDialogOpen={handleStatusChange} minHeight={740}>
                <FormProvider {...methods}>
                    <Stack
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            methods.handleSubmit(onSubmit)(e);
                        }}
                        autoComplete="off"
                        sx={{
                            justifyContent: "space-between",
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1
                        }}
                    >
                        <DialogTitle>{t("form:user.create.title")}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <Typography color={"textDisabled"}>{t("form:user.create.description")}</Typography>
                                <UserFormFields/>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{px: 3, mb: 2}}>
                            <Button
                                onClick={() => closeDialog(ref)}
                                sx={{height: 35}}
                            >
                                {t("common:button.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{px: 1, pr: 1.5, width: 210, height: 35}}
                                disabled={pending}
                            >
                                {pending ? (
                                    <CircularProgress
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <PersonAddIcon fontSize="small"
                                                       sx={{mr: 0.4}}/>{t("common:table.actions.create-user")}
                                    </>
                                )}
                            </Button>
                        </DialogActions>
                    </Stack>
                </FormProvider>
            </BaseDialog>
        )
    }
);
export default forwardRef(CreateUserDialog);

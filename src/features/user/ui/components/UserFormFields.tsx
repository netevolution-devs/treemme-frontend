import { useTranslation } from "react-i18next";
import {Box, Button, Stack, Tooltip, Typography} from "@mui/material";
import EmailField from "@shared/ui/form/controlled/EmailField";
import PasswordField from "@shared/ui/form/controlled/PasswordField";
import RoleSelect from "./RoleSelect";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useFormContext } from "react-hook-form";
import type {IUserForm} from "@features/user/model/IUserForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import usePasswordGenerator from "@ui/form/controlled/usePasswordGenerator";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";

interface Props {
    disablePassword?: boolean;
    disableRoleSelect?: boolean;
} 

const UserFormFields = ({disablePassword = false, disableRoleSelect = false }: Props) => {
    const {t} = useTranslation(["common", "form"]);

    const { generatePassword } = usePasswordGenerator();
    const { setValue } = useFormContext();

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setValue('password', newPassword, { shouldTouch: true, shouldDirty: true, shouldValidate: true });
    };

    return (
        <Stack gap={0.7}>
            <TextFieldControlled<IUserForm> 
                name="firstName"
                label={t("form:user.create.fields.first-name")}
                required
            />
            <TextFieldControlled<IUserForm> 
                name="lastName"
                label={t("form:user.create.fields.last-name")}
                required
            />
            <EmailField<IUserForm> 
                name="email"
                required
                showRequired
                autoComplete={"new-email"}
            />
            {!disablePassword && (
                <Box sx={{display: 'flex', gap: 1}}>
                        <PasswordField<IUserForm> 
                            name="password"
                            required
                            autoComplete={"new-password"}
                            rules={{ 
                                minLength: { value: 8, message: t("common:form.error.too-short") },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/,
                                    message: t("form:user.create.rules.password.pattern")
                                }
                            }}
                        />
                        <Tooltip 
                            arrow
                            title={t("form:user.create.rules.password.tooltip") || ""}
                            placement="top"
                            
                            children={
                                <Button 
                                    sx={{p: 0, height: 40, minWidth: 50}} 
                                    variant="outlined"
                                    onClick={() => handleGeneratePassword()}
                                >
                                    <VpnKeyIcon />
                                </Button>
                            }
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
                        />
                </Box>
            )}
            <TextFieldControlled<IUserForm> 
                name="fiscalCode"
                label={t("form:user.create.fields.fiscal-code")}
                required
            />
            <NumberFieldControlled<IUserForm>
                name="phone"
                label={t("form:user.create.fields.phone")}
                required
            />
            <TextFieldControlled<IUserForm> 
                name="address"
                label={t("form:user.create.fields.address")}
                required
            />
            {!disableRoleSelect && (
                <>
                    <Typography variant="h6">{t("form:user.create.fields.roles")}</Typography>
                    <RoleSelect<IUserForm>
                        name="roles"
                    />
                </>
            )}
        </Stack>
    )
}

export default UserFormFields;
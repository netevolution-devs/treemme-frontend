import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import type {ControlledFieldProps} from "./ControlledFieldProps";
import ErrorFormHelperText from "../ErrorFormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = <TFieldValues extends FieldValues>({
                                                             name,
                                                             label,
                                                             required = false,
                                                             showRequired = true,
                                                             rules,
                                                             autoComplete
                                                         }: ControlledFieldProps<TFieldValues>) => {
    const {t} = useTranslation(["common"])
    const {control} = useFormContext<TFieldValues>();
    const [showPassword, setShowPassword] = useState(false)

    const formattedLabelString = label ? label : t("common:form.field.password")
    const formattedLabel = required && showRequired && formattedLabelString ? `${formattedLabelString} *` : formattedLabelString;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                ...rules,
                required: {value: required, message: t("common:form.error.required")},
                maxLength: {value: 255, message: t("common:form.error.too-long")},
            }}
            render={({field, fieldState: {error}}) =>
                <TextField
                    {...field}
                    label={formattedLabel}
                    type={showPassword ? "text" : "password"}
                    autoComplete={autoComplete || "off"}
                    helperText={error?.message ?? " "}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        },
                        inputLabel: {
                            shrink: !!field.value,
                        },
                        formHelperText: {
                            component: ({children}) =>
                                <ErrorFormHelperText isError={!!error} children={children}/>
                        },
                        htmlInput: {maxLength: 255},
                    }}
                    error={!!error}
                />
            }
        />
    )
}

export default PasswordField;

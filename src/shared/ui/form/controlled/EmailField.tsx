import {TextField} from "@mui/material";
import {
    Controller,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import {useTranslation} from "react-i18next";
import type {ControlledFieldProps} from "./ControlledFieldProps";
import ErrorFormHelperText from "../ErrorFormHelperText";

const EmailField = <TFieldValues extends FieldValues>({
                                                          name,
                                                          label,
                                                          required = false,
                                                          showHelperRow = true,
                                                          showRequired = false,
                                                      }: ControlledFieldProps<TFieldValues>) => {
    const {t} = useTranslation(["common"])
    const {control} = useFormContext<TFieldValues>();

    const formattedLabelString = label ? label : t("common:form.field.email")
    const formattedLabel = required && showRequired && formattedLabelString ? `${formattedLabelString} *` : formattedLabelString;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {value: required, message: t("common:form.error.required")},
                maxLength: {value: 255, message: t("common:form.error.too-long")},
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: t("common:form.error.invalid-email")
                },
            }}
            render={({field, fieldState: {error}}) =>
                <TextField
                    {...field}
                    label={formattedLabel}
                    helperText={error?.message ?? (showHelperRow ? " " : "")}
                    slotProps={{
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

export default EmailField;

import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps.ts";
import { useTranslation } from "react-i18next";
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio, Box,
} from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText.tsx";

interface RadioFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    options: { value: string | number; label: string }[];
    row?: boolean;
}

const RadioFieldControlled = <TFieldValues extends FieldValues>({
                                                                     name,
                                                                     label,
                                                                     required = false,
                                                                     showHelperRow = true,
                                                                     options = [],
                                                                     row = true,
                                                                 }: RadioFieldProps<TFieldValues>) => {
    const { t } = useTranslation(["common"]);
    const {
        control,
        formState: { disabled }
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t("common:form.error.required") },
            }}
            render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
                const currentValue = (value === undefined || value === null) ? "" : value;

                return (
                    <FormControl error={!!error} component="fieldset" disabled={disabled} fullWidth>
                        {label && (
                            <FormLabel component="legend" sx={{ fontSize: "0.90rem", color: "text.primary" }}>
                                {formattedLabel}
                            </FormLabel>
                        )}
                        <Box sx={{ p: 1 }}>
                            <RadioGroup
                                row={row}
                                value={currentValue === "" ? "" : String(currentValue)}
                                onChange={(event) => {
                                    const val = event.target.value;
                                    const option = options.find(opt => String(opt.value) === val);
                                    onChange(option ? option.value : val);
                                }}
                                onBlur={onBlur}
                                ref={ref}
                            >
                                {options.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        value={String(option.value)}
                                        control={<Radio size="small" />}
                                        label={option.label}
                                        slotProps={{
                                            typography: { variant: "body2" }
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                            <ErrorFormHelperText isError={!!error}>
                                {error?.message ?? (showHelperRow ? " " : "")}
                            </ErrorFormHelperText>
                        </Box>
                    </FormControl>
                );
            }}
        />
    );
};

export default RadioFieldControlled;

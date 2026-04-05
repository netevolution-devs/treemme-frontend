import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import type {ControlledFieldProps} from "@ui/form/controlled/ControlledFieldProps";
import {useTranslation} from "react-i18next";
import {Autocomplete, Box, Chip, TextField} from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";

interface SelectFieldMultipleProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    options: { value: string | number; label: string }[];
    minWidth?: number | string;
    deactivated?: boolean;
}

const SelectFieldMultipleControlled = <TFieldValues extends FieldValues>({
    name,
    label,
    required = false,
    showHelperRow = false,
    options = [],
    TextFieldProps,
    minWidth = 150,
    deactivated = false,
}: SelectFieldMultipleProps<TFieldValues>) => {
    const {t} = useTranslation(["common"]);
    const {
        control,
        formState: {disabled}
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {value: required, message: t("common:form.error.required")},
            }}
            render={({field: {onChange, value, onBlur, ref}, fieldState: {error}}) => {
                const selectedValues: (string | number)[] = Array.isArray(value) ? value : [];
                const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

                return (
                    <Autocomplete
                        multiple
                        sx={{minWidth, width: "100%"}}
                        options={options}
                        disabled={disabled || deactivated}
                        value={selectedOptions}
                        noOptionsText={t("common:search.no-options")}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, val) => option.value === val?.value}
                        onChange={(_, newValues) => {
                            onChange(newValues.map(v => v.value));
                        }}
                        onBlur={onBlur}
                        renderTags={(tagValues, getTagProps) =>
                            tagValues.map((option, index) => {
                                const {key, ...tagProps} = getTagProps({index});
                                return <Chip key={key} label={option.label} size="small" {...tagProps} />;
                            })
                        }
                        renderInput={(params) => {
                            const {InputLabelProps, InputProps, inputProps, ...restParams} = params;

                            return (
                                <TextField
                                    {...restParams}
                                    {...TextFieldProps}
                                    inputRef={ref}
                                    label={formattedLabel}
                                    size="small"
                                    fullWidth
                                    sx={{mb: 1.2}}
                                    error={!!error}
                                    helperText={error?.message ?? (showHelperRow ? " " : "")}
                                    slotProps={{
                                        ...TextFieldProps?.slotProps,
                                        inputLabel: {
                                            ...(TextFieldProps?.slotProps?.inputLabel as object | undefined),
                                            className: InputLabelProps?.className ?? "",
                                        },
                                        input: {
                                            ...(InputProps as object | undefined),
                                            ...(TextFieldProps?.slotProps?.input as object | undefined),
                                        },
                                        htmlInput: {
                                            ...inputProps,
                                            ...(TextFieldProps?.slotProps?.htmlInput as object | undefined),
                                        },
                                        formHelperText: {
                                            ...(TextFieldProps?.slotProps?.formHelperText as object | undefined),
                                            component: (({children}: {children: React.ReactNode}) =>
                                                <ErrorFormHelperText isError={!!error}>{children}</ErrorFormHelperText>
                                            ) as React.ElementType,
                                        },
                                    }}
                                />
                            );
                        }}
                        renderOption={(props, option) => {
                            const {key, ...otherProps} = props;
                            return (
                                <Box component="li" key={key} {...otherProps}>
                                    {option.label}
                                </Box>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default SelectFieldMultipleControlled;

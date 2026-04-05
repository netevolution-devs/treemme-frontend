import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField, Box } from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";
import { useEffect, useState } from "react";
import { useDockviewStore } from "@ui/panel/store/DockviewStore";

interface SelectFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    options: { value: string | number; label: string }[];
    minWidth?: number | string;
    deactivated?: boolean;
    onNoOptionsMatch?: (inputValue: string) => void;
}

const SelectFieldControlled = <TFieldValues extends FieldValues>({
                                                                     name,
                                                                     label,
                                                                     required = false,
                                                                     showHelperRow = false,
                                                                     options = [],
                                                                     TextFieldProps,
                                                                     minWidth = 150,
                                                                     deactivated = false,
                                                                     onNoOptionsMatch,
                                                                 }: SelectFieldProps<TFieldValues>) => {
    const { t } = useTranslation(["common"]);
    const {
        control,
        formState: { disabled }
    } = useFormContext<TFieldValues>();

    const activePanelId = useDockviewStore(state => state.activePanelId);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [activePanelId]);

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t("common:form.error.required") },
            }}
            render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
                const selectedOption = options.find(opt => opt.value === value) || null;

                return (
                    <Autocomplete
                        sx={{ minWidth, width: "100%" }}
                        options={options}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        disabled={disabled || deactivated}
                        value={selectedOption}
                        noOptionsText={t("common:search.no-options")}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, val) => option.value === val?.value}
                        onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : null);
                        }}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && onNoOptionsMatch) {
                                const target = e.target as HTMLInputElement;
                                const inputValue = target.value;
                                const match = options.find(opt => opt.label.toLowerCase() === inputValue.toLowerCase());
                                if (!match && inputValue.trim()) {
                                    onNoOptionsMatch(inputValue);
                                    target.blur();
                                }
                            }
                        }}
                        renderInput={(params) => {
                            const { InputLabelProps, InputProps, inputProps, ...restParams } = params;

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
                                            component: (({ children }: { children: React.ReactNode }) =>
                                                    <ErrorFormHelperText isError={!!error}>{children}</ErrorFormHelperText>
                                            ) as React.ElementType,
                                        },
                                    }}
                                />
                            );
                        }}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
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

export default SelectFieldControlled;
import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField, Box } from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";
import { useEffect, useState, useMemo } from "react";
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
    const [inputValue, setInputValue] = useState("");

    // Chiudi il menu se cambia il pannello attivo
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

                // Logica per il testo "fantasma" (ghost text)
                const suggestion = useMemo(() => {
                    if (!inputValue || !open) return null;
                    return options.find(opt =>
                        opt.label.toUpperCase().startsWith(inputValue.toUpperCase())
                    );
                }, [inputValue, options, open]);

                const ghostText = suggestion
                    ? inputValue + suggestion.label.slice(inputValue.length).toUpperCase()
                    : "";

                return (
                    <Autocomplete
                        sx={{ minWidth, width: "100%" }}
                        options={options}
                        open={open}
                        autoHighlight
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        disabled={disabled || deactivated}
                        value={selectedOption}
                        inputValue={inputValue}
                        onInputChange={(_, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        noOptionsText={t("common:search.no-options")}
                        getOptionLabel={(option) => (option.label || "").toUpperCase()}
                        isOptionEqualToValue={(option, val) => option.value === val?.value}
                        onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : null);
                        }}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                            // Accetta il suggerimento con Freccia Destra o Tab
                            if ((e.key === "Tab" || e.key === "ArrowRight") && ghostText && ghostText !== inputValue.toUpperCase()) {
                                if (suggestion) {
                                    onChange(suggestion.value);
                                    setInputValue(suggestion.label.toUpperCase());
                                }
                            }

                            if (e.key === 'Enter' && onNoOptionsMatch) {
                                const target = e.target as HTMLInputElement;
                                const currentVal = target.value;
                                const match = options.find(opt => opt.label.toLowerCase() === currentVal.toLowerCase());
                                if (!match && currentVal.trim()) {
                                    onNoOptionsMatch(currentVal);
                                    target.blur();
                                }
                            }
                        }}
                        renderInput={(params) => {
                            const { InputLabelProps, InputProps, inputProps, ...restParams } = params;

                            return (
                                <Box sx={{ position: "relative" }}>
                                    {/* Layer del suggerimento grigio */}
                                    {ghostText && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                left: 10,
                                                color: "grey.400",
                                                pointerEvents: "none",
                                                textTransform: "uppercase",
                                                fontFamily: "inherit",
                                                whiteSpace: "pre",
                                                zIndex: 0
                                            }}
                                        >
                                            {ghostText}
                                        </Box>
                                    )}
                                    <TextField
                                        {...restParams}
                                        {...TextFieldProps}
                                        inputRef={ref}
                                        label={formattedLabel}
                                        size="small"
                                        fullWidth
                                        sx={{ mb: 1.2 }}
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
                                                sx: {
                                                    textTransform: "uppercase",
                                                    backgroundColor: "transparent",
                                                    zIndex: 1
                                                },
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
                                </Box>
                            );
                        }}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <Box component="li" key={key} {...otherProps} sx={{ textTransform: "uppercase" }}>
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
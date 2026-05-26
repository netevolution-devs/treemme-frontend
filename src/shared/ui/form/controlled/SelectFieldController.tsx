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
    const [highlightedOption, setHighlightedOption] = useState<{ value: string | number; label: string } | null>(null);

    // Chiudi il menu se cambia il pannello attivo
    useEffect(() => {
        setOpen(false);
    }, [activePanelId]);

    const formattedLabel = required && label ? `${label} *` : label;

    // Logica per il testo "fantasma" (ghost text) e filtraggio opzioni
    const filteredOptions = useMemo(() => {
        if (!inputValue) return options;
        return options.filter(opt =>
            opt.label.toUpperCase().startsWith(inputValue.toUpperCase())
        );
    }, [options, inputValue]);

    const suggestion = useMemo(() => {
        if (!open) return null;
        if (highlightedOption) return highlightedOption;
        if (!inputValue) return null;
        return filteredOptions.find(opt =>
            opt.label.toUpperCase().startsWith(inputValue.toUpperCase())
        );
    }, [inputValue, filteredOptions, open, highlightedOption]);

    const ghostText = useMemo(() => {
        if (!suggestion) return "";
        const label = suggestion.label.toUpperCase();
        if (label.startsWith(inputValue.toUpperCase())) {
            return inputValue + label.slice(inputValue.length);
        }
        return label;
    }, [suggestion, inputValue]);

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
                        options={filteredOptions}
                        open={open}
                        filterOptions={(x) => x}
                        autoHighlight
                        onOpen={() => setOpen(true)}
                        onClose={() => {
                            setOpen(false);
                            setHighlightedOption(null);
                        }}
                        onHighlightChange={(_, option) => {
                            setHighlightedOption(option);
                        }}
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
                        onBlur={() => {
                            onBlur();
                            const exactMatch = filteredOptions.find(
                                opt => opt.label.toUpperCase() === inputValue.toUpperCase()
                            );
                            if (exactMatch) {
                                onChange(exactMatch.value);
                                setInputValue(exactMatch.label.toUpperCase());
                            }
                        }}
                        onKeyDown={(e) => {
                            // Accetta il suggerimento con Freccia Destra o Tab
                            if ((e.key === "Tab" || e.key === "ArrowRight") && ghostText && ghostText !== inputValue.toUpperCase()) {
                                if (suggestion) {
                                    onChange(suggestion.value);
                                    setInputValue(suggestion.label.toUpperCase());
                                    if (e.key === "ArrowRight") e.preventDefault();
                                }
                            }

                            if (e.key === 'Enter' && onNoOptionsMatch) {
                                const target = e.target as HTMLInputElement;
                                const currentVal = target.value;
                                const match = filteredOptions.find(opt => opt.label.toLowerCase() === currentVal.toLowerCase());
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
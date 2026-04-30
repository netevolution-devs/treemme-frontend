import { Autocomplete, TextField, IconButton, InputAdornment, Box, createFilterOptions } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

interface SelectFieldOption {
    value: string | number;
    label: string;
}

interface SelectFieldFilterProps {
    value: string | number | undefined | null;
    onFilterChange: (newValue: string | number | undefined) => void;
    options: SelectFieldOption[];
    label?: string;
    placeholder?: string;
}

const defaultFilterOptions = createFilterOptions<SelectFieldOption>();

const SelectFieldFilter = ({ value, onFilterChange, options, label, placeholder = "" }: SelectFieldFilterProps) => {
    const { t } = useTranslation(["common"]);
    const [inputValue, setInputValue] = useState("");
    const filteredOptionsRef = useRef<SelectFieldOption[]>(options);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync inputValue when external value is cleared (e.g. form reset)
    useEffect(() => {
        if (value === undefined || value === null) {
            setInputValue("");
        }
    }, [value]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        setInputValue("");
        onFilterChange(undefined);
    };

    return (
        <Autocomplete<SelectFieldOption, false, false, false>
            sx={{ minWidth: 200, width: "100%" }}
            options={options}
            autoHighlight={true}
            value={null}
            inputValue={inputValue}
            filterOptions={(opts, state) => {
                const filtered = defaultFilterOptions(opts, state);
                filteredOptionsRef.current = filtered;
                return filtered;
            }}
            onInputChange={(_, newInputValue, reason) => {
                if (reason !== "input") return;

                setInputValue(newInputValue);

                if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

                if (newInputValue) {
                    debounceTimerRef.current = setTimeout(() => {
                        const firstOption = filteredOptionsRef.current[0];
                        if (firstOption) {
                            onFilterChange(firstOption.value);
                        }
                    }, 300);
                } else {
                    onFilterChange(undefined);
                }
            }}
            noOptionsText={t("common:search.no-options")}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            onChange={(_, newValue) => {
                // User explicitly clicked/entered an option from the list
                if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
                if (newValue) {
                    setInputValue(newValue.label);
                    onFilterChange(newValue.value);
                }
            }}
            size="small"
            clearIcon={null}
            renderInput={(params) => {
                const { InputLabelProps, ...restParams } = params;
                return (
                    <TextField
                        {...restParams}
                        label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        size="small"
                        slotProps={{
                            inputLabel: {
                                ...InputLabelProps,
                                className: InputLabelProps?.className ?? ""
                            },
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {inputValue && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="clear filter"
                                                    onClick={handleClear}
                                                    edge="end"
                                                    size="small"
                                                    sx={{ mr: -1.5 }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
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
};

export default SelectFieldFilter;

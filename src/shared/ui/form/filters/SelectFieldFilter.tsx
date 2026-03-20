import { Autocomplete, TextField, IconButton, InputAdornment, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
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

const SelectFieldFilter = ({ value, onFilterChange, options, label, placeholder = "" }: SelectFieldFilterProps) => {
    const { t } = useTranslation(["common"]);

    const selectedOption = options.find(opt => opt.value === value) || null;

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFilterChange(undefined);
    };

    return (
        <Autocomplete<SelectFieldOption, false, true, false>
            sx={{ minWidth: 200, width: "100%" }}
            options={options}
            value={selectedOption as SelectFieldOption}
            noOptionsText={t("common:search.no-options")}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            onChange={(_, newValue) => {
                onFilterChange(newValue ? newValue.value : undefined);
            }}
            size="small"
            disableClearable
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
                                        {selectedOption && (
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

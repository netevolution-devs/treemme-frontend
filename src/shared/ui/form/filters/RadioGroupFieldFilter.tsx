import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Box
} from "@mui/material";

interface RadioOption {
    label: string;
    value: string | number;
}

interface RadioGroupFieldFilterProps {
    value: string | number | undefined;
    onFilterChange: (newValue: string | number | undefined) => void;
    options: RadioOption[];
    label?: string;
    row?: boolean;
}

const RadioGroupFieldFilter = ({
                                   value,
                                   onFilterChange,
                                   options,
                                   label,
                                   row = true
                               }: RadioGroupFieldFilterProps) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const originalOption = options.find(opt => opt.value.toString() === newValue);
        onFilterChange(originalOption ? originalOption.value : newValue);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <FormControl component="fieldset" variant="standard" sx={{ display: 'flex', flexDirection: row ? 'row' : 'column', alignItems: 'center' }}>
                {label && (
                    <FormLabel 
                        component="legend" 
                        sx={{ 
                            fontSize: '0.75rem',
                            mb: 0,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {label}
                    </FormLabel>
                )}
                <RadioGroup
                    row={row}
                    value={value ?? ""}
                    onChange={handleChange}
                    sx={{
                        flexWrap: 'nowrap',
                        display: 'flex',
                        gap: 2,
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                        },
                        '& .MuiFormControlLabel-root': {
                            '& .MuiButtonBase-root': {
                                p: 0.5
                            }
                        }
                    }}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default RadioGroupFieldFilter;

import { useEffect, useState } from "react";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import type { DateView } from "@mui/x-date-pickers/models";
import dayjs, {type Dayjs} from "dayjs";

interface DateFieldFilterProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
    value: string | number | undefined;
    onFilterChange: (newValue: string | number | undefined) => void;
    type?: 'year' | 'fullDate';
}

const DateFieldFilter = ({ value, onFilterChange, type = 'fullDate', ...props }: DateFieldFilterProps) => {
    const isYear = type === 'year';
    const format = isYear ? "YYYY" : "YYYY-MM-DD";
    const views: readonly DateView[] = isYear ? ['year'] : ['year', 'month', 'day'];

    const [localValue, setLocalValue] = useState<Dayjs | null>(value ? dayjs(value.toString(), isYear ? "YYYY" : undefined) : null);
    const [prevValue, setPrevValue] = useState<string | number | undefined>(value);

    if (value !== prevValue) {
        setLocalValue(value ? dayjs(value.toString(), isYear ? "YYYY" : undefined) : null);
        setPrevValue(value);
    }

    useEffect(() => {
        const currentFormatted = localValue?.isValid() ? localValue.format(format) : undefined;
        const previousFormatted = value?.toString() ?? undefined;

        if (currentFormatted === previousFormatted) return;

        const handler = setTimeout(() => {
            onFilterChange(isYear && currentFormatted ? parseInt(currentFormatted) : currentFormatted);
        }, 500);

        return () => clearTimeout(handler);
    }, [localValue, onFilterChange, value, format, isYear]);

    const handleClear = () => {
        setLocalValue(null);
        onFilterChange(undefined);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            <DatePicker
                {...props}
                views={views}
                value={localValue}
                onChange={(newValue) => setLocalValue(newValue)}
                slotProps={{
                    ...props.slotProps,
                    field: {
                        clearable: true,
                        onClear: () => handleClear(),
                    },
                    textField: {
                        size: "small",
                        fullWidth: true,
                        ...props.slotProps?.textField,
                        sx: {
                            "& .MuiPickersInputBase-root": {
                                paddingTop: "0 !important",
                                paddingBottom: "0 !important",
                                minHeight: "unset",
                            },
                            "& .MuiPickersSectionList-root": {
                                paddingTop: "4px !important",
                                paddingBottom: "4px !important",
                            },
                            "& .MuiInputAdornment-root": {
                                height: "auto",
                                maxHeight: "none",
                            },
                            ...props.slotProps?.textField,
                        },
                    },
                    openPickerButton: {
                        size: "small",
                        ...props.slotProps?.openPickerButton,
                        sx: {
                            padding: "0px",
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.2rem",
                            },
                            ...props.slotProps?.openPickerButton,
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default DateFieldFilter;

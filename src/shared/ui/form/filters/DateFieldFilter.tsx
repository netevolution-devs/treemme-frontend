import { useEffect, useState } from "react";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import dayjs, {type Dayjs} from "dayjs";

interface DateFieldFilterProps extends Omit<DatePickerProps<boolean>, 'onChange' | 'value'> {
    value: string | undefined;
    onFilterChange: (newValue: string | undefined) => void;
}

const DateFieldFilter = ({ value, onFilterChange, ...props }: DateFieldFilterProps) => {
    const [localValue, setLocalValue] = useState<Dayjs | null>(value ? dayjs(value) : null);
    const [prevValue, setPrevValue] = useState<string | undefined>(value);

    if (value !== prevValue) {
        setLocalValue(value ? dayjs(value) : null);
        setPrevValue(value);
    }

    useEffect(() => {
        const currentFormatted = localValue?.isValid() ? localValue.format("YYYY-MM-DD") : undefined;
        const previousFormatted = value ?? undefined;

        if (currentFormatted === previousFormatted) return;

        const handler = setTimeout(() => {
            onFilterChange(currentFormatted);
        }, 500);

        return () => clearTimeout(handler);
    }, [localValue, onFilterChange, value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            <DatePicker
                sx={{mt: 0.3}}
                {...props}
                value={localValue}
                onChange={(newValue) => setLocalValue(newValue)}
                slotProps={{
                    ...props.slotProps,
                    textField: {
                        size: "small",
                        ...props.slotProps?.textField,
                    },
                    openPickerButton: {
                        size: "small",
                        ...props.slotProps?.openPickerButton,
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default DateFieldFilter;

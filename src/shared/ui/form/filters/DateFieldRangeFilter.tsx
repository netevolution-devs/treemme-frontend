import DateFieldFilter from "@ui/form/filters/DateFieldFilter.tsx";
import dayjs from "dayjs";

interface DateFieldRangeFilterProps {
    startValue: string | undefined;
    endValue: string | undefined;
    onStartFilterChange: (newValue: string | undefined) => void;
    onEndFilterChange: (newValue: string | undefined) => void;
    startLabel?: string;
    endLabel?: string;
}

const DateFieldRangeFilter = ({
                                  startValue,
                                  endValue,
                                  onStartFilterChange,
                                  onEndFilterChange,
                                  startLabel,
                                  endLabel
                              }: DateFieldRangeFilterProps) => {

    const handleStartChange = (newStart: string | undefined) => {
        onStartFilterChange(newStart);
        if (newStart && endValue && dayjs(newStart).isAfter(dayjs(endValue))) {
            onEndFilterChange(newStart);
        }
    };

    const handleEndChange = (newEnd: string | undefined) => {
        onEndFilterChange(newEnd);
        if (newEnd && startValue && dayjs(newEnd).isBefore(dayjs(startValue))) {
            onStartFilterChange(newEnd);
        }
    };

    return (
        <>
            <DateFieldFilter
                label={startLabel}
                value={startValue}
                onFilterChange={handleStartChange}
            />
            <DateFieldFilter
                label={endLabel}
                value={endValue}
                onFilterChange={handleEndChange}
                minDate={startValue ? dayjs(startValue) : dayjs().subtract(30, 'year')}
            />
        </>
    );
};

export default DateFieldRangeFilter;

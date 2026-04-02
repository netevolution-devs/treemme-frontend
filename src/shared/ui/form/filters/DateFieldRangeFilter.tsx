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

    const handleStartChange = (newStart: string | number | undefined) => {
        onStartFilterChange(newStart as string | undefined);
        if (newStart && endValue && dayjs(newStart.toString()).isAfter(dayjs(endValue))) {
            onEndFilterChange(newStart as string | undefined);
        }
    };

    const handleEndChange = (newEnd: string | number | undefined) => {
        onEndFilterChange(newEnd as string | undefined);
        if (newEnd && startValue && dayjs(newEnd.toString()).isBefore(dayjs(startValue))) {
            onStartFilterChange(newEnd as string | undefined);
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

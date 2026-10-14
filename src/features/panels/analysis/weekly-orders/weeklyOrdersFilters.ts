import dayjs from "dayjs";
import type {IWeeklyOrdersFilters} from "./WeeklyOrdersPanel";

export const getCurrentWeekFilters = (today = dayjs()): IWeeklyOrdersFilters => {
    const monday = today.subtract((today.day() + 6) % 7, "day");
    return {
        filterStartDate: monday.format("YYYY-MM-DD"),
        filterEndDate: monday.add(6, "day").format("YYYY-MM-DD"),
    };
};

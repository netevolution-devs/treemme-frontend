import {Box, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import TextFieldValue from "@ui/form/controlled/TextFieldValue";
import type {IWeeklyOrdersFilters, IWeeklyOrdersUIState} from "./WeeklyOrdersPanel";
import type {IWeeklyOrderTotals} from "./api/IWeeklyOrderAverage";
import useWeeklyOrdersData from "./useWeeklyOrdersData";

const WeeklyOrdersDetail = () => {
    const {t, i18n} = useTranslation(["form"]);
    const {useStore} = usePanel<IWeeklyOrdersFilters, IWeeklyOrdersUIState>();
    const selectedId = useStore(state => state.uiState.selectedAverageId);
    const {data, rows, isLoading, isError} = useWeeklyOrdersData();
    const selected = rows.find(row => row.id === selectedId);
    const decimals = new Intl.NumberFormat(i18n.language, {maximumFractionDigits: 2});
    const format = (value: number | null) =>
        value == null ? "-" : decimals.format(value);

    const renderTotals = (totals: IWeeklyOrderTotals) => (
        <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
            <TextFieldValue label={t("weekly-orders.rows-count")} value={totals.rows_count} isFilled/>
            <TextFieldValue label={t("weekly-orders.total-amount")} value={format(totals.total_amount)} isFilled/>
            <TextFieldValue label={t("weekly-orders.quantity-pq")} value={format(totals.total_quantity_pq)} isFilled/>
            <TextFieldValue label={t("weekly-orders.quantity-mq")} value={format(totals.total_quantity_mq)} isFilled/>
            <TextFieldValue label={t("weekly-orders.average-price-pq")} value={format(totals.avg_price_pq)} isFilled/>
            <TextFieldValue label={t("weekly-orders.average-price-mq")} value={format(totals.avg_price_mq)} isFilled/>
        </Box>
    );

    if (isLoading || isError || !data) return null;

    return (
        <Stack gap={2}>
            {selected ? (
                <Stack gap={1}>
                    <Typography variant={"subtitle1"}>
                        {t("weekly-orders.detail")} · {selected.leather_type?.name ?? t("weekly-orders.not-specified")}
                    </Typography>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                        <TextFieldValue label={t("weekly-orders.leather-code")} value={selected.leather_type?.code ?? ""} isFilled/>
                        <TextFieldValue label={t("weekly-orders.currency")} value={selected.currency?.name ?? t("weekly-orders.not-specified")} isFilled/>
                        <TextFieldValue label={t("weekly-orders.currency-code")} value={selected.currency?.abbreviation ?? ""} isFilled/>
                        <TextFieldValue label={t("weekly-orders.currency-sign")} value={selected.currency?.sign ?? ""} isFilled/>
                        <TextFieldValue label={t("weekly-orders.total-currency-amount")} value={format(selected.total_currency_amount)} isFilled/>
                    </Box>
                    {renderTotals(selected)}
                </Stack>
            ) : (
                <Typography variant={"body2"} color={"text.secondary"}>
                    {t("weekly-orders.select-row")}
                </Typography>
            )}
        </Stack>
    );
};

export default WeeklyOrdersDetail;

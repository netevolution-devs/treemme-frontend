import {Box, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import TextFieldValue from "@ui/form/controlled/TextFieldValue";

const BatchesLotsResume = () => {
    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data, isLoading} = batchApi.useGetBatchReport(selectedBatchId as number);
    const report = data?.report;

    if (isLoading) return (
        <Card variant={"elevation"}>
            <CardContent sx={{width: "700px"}}>
                <CircularProgress/>
                <Typography>Caricamento...</Typography>
            </CardContent>
        </Card>
    );

    if (!report) return null;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 5.5, ml: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Totale Pezzi"}
                    value={report.total_pieces}
                    isFilled={true}
                />
                <TextFieldValue
                    label={"Totale Quantità"}
                    value={report.total_quantity}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Totale Quantità (ft²)"}
                    value={report.total_quantity_ftsq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Pezzi Venduti"}
                    value={report.sold_pieces}
                    isFilled={true}
                />
                <TextFieldValue
                    label={"Quantità Venduta"}
                    value={report.sold_quantity}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Quantità Venduta (ft²)"}
                    value={report.sold_quantity_ftsq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Pezzi Disponibili"}
                    value={report.available_pieces}
                    isFilled={true}
                />
                <TextFieldValue
                    label={"Quantità Disponibile"}
                    value={report.available_quantity}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Quantità Disponibile (ft²)"}
                    value={report.available_quantity_ftsq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Prezzo Vendita / Pelle"}
                    value={report.sale_price_per_leather}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Prezzo Vendita Totale"}
                    value={report.total_sale_price}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Ricavo Totale"}
                    value={report.total_revenue}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Ricavo Medio / Pelle"}
                    value={report.average_revenue_per_leather}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"ft² Medi / Pelle"}
                    value={report.average_ftsq_per_leather}
                    isFilled={true}
                    precision={2}
                />
            </Box>
        </Box>
    )
};

export default BatchesLotsResume;
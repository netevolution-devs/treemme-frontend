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
                    label={"Totale Quantità (PQ)"}
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
                    label={"Quantità Venduta (PQ)"}
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
                    label={"Quantità Disponibile (PQ)"}
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
                    label={"PQ Medi / Pelle"}
                    value={report.average_ftsq_per_leather}
                    isFilled={true}
                    precision={2}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Costi Totali"}
                    value={report.total_costs}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Piedaggio Teorico"}
                    value={report.sq_ft_average_expected}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Piedaggio Effettivo"}
                    value={report.sq_ft_average_found}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Differenza Piedaggio"}
                    value={report.sq_ft_average_diff}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Pelli Scartate"}
                    value={report.compensation_waste}
                    isFilled={true}
                    precision={0}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Costo/Pezzo (€/MQ)"}
                    value={report.cost_per_piece_euro_mq}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Costo/Pezzo (Lire/PQ)"}
                    value={report.cost_per_piece_lire_pq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Ricavo/Pezzo (€/MQ)"}
                    value={report.revenue_per_piece_euro_mq}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Ricavo/Pezzo (Lire/PQ)"}
                    value={report.revenue_per_piece_lire_pq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Crosta Venduta (€/MQ)"}
                    value={report.sc_sale_revenue_euro_mq}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Crosta Venduta (Lire/PQ)"}
                    value={report.sc_sale_revenue_lire_pq}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Ricavo Fiore (€)"}
                    value={report.flower_total_revenue}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Ricavo Fiore (Lire)"}
                    value={report.flower_total_revenue_lire}
                    isFilled={true}
                    precision={2}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldValue
                    label={"Costo Fiore (€/MQ)"}
                    value={report.flower_cost_euro_mq}
                    isFilled={true}
                    precision={2}
                />
                <TextFieldValue
                    label={"Costo Fiore (Lire/PQ)"}
                    value={report.flower_cost_lire_pq}
                    isFilled={true}
                    precision={2}
                />
            </Box>
        </Box>
    )
};

export default BatchesLotsResume;
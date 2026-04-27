import { useState } from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Typography, Box } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from "dayjs";
import type { IBatchesStoreState } from "@features/panels/production/batches/BatchesPanel";
import { usePanel } from "@ui/panel/PanelContext";
import { batchApi } from "@features/panels/production/batches/api/batchApi";
import type {IBatch, IFatcherBatchDetails} from "@features/panels/production/batches/api/IBatch";

interface TreeNodeProps {
    batch: IBatch;
    details?: IFatcherBatchDetails[];
}

// const getBatchIds = (batch: IBatch | undefined): string[] => {
//     if (!batch) return [];
//     const ids: string[] = [];
//     const hasChildren = batch.son_batches && batch.son_batches.length > 0;
//
//     if (hasChildren) {
//         ids.push(batch.batch_code);
//         batch.son_batches.forEach((son) => {
//             if (son.batch) {
//                 ids.push(...getBatchIds(son.batch));
//             }
//         });
//     }
//     return ids;
// };

const TreeNode = ({ batch, details }: TreeNodeProps) => {
    const hasChildren = batch.son_batches && batch.son_batches.length > 0;

    const Label = (
        <Box sx={{ py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                    {batch.batch_code}
                </Typography>
                <Typography color="text.secondary" sx={{fontSize: '15px'}}>
                    {`(${batch.stock_items}/${batch.pieces}) - ${dayjs(batch.batch_date).format('DD/MM/YYYY')}`}
                </Typography>
            </Box>

            {details?.map((detail, idx) => (
                <Typography
                    key={idx}
                    display="block"
                >
                    {detail.father_batch_pieces} - {dayjs(detail.date).format('DD/MM/YYYY')}
                </Typography>
            ))}
        </Box>
    );

    return (
        <TreeItem
            itemId={batch.batch_code}
            label={Label}
            slots={{
                expandIcon: ChevronRightIcon,
                collapseIcon: ExpandMoreIcon,
                endIcon: ChevronRightIcon,
            }}
            slotProps={{
                content: {
                    // @ts-expect-error - sx is not correctly typed in SlotComponentProps but it is supported at runtime
                    sx: {
                        alignItems: 'flex-start',
                        '& .MuiTreeItem-iconContainer': {
                            marginTop: '5px',
                            display: 'flex',
                            '& svg': {
                                fontSize: '1.2rem',
                            }
                        }
                    },
                },
            }}
        >
            {hasChildren && batch.son_batches.map((son, index) => (
                son.batch && (
                    <TreeNode
                        key={`${son.batch.batch_code}-${index}`}
                        batch={son.batch}
                        details={son.details}
                    />
                )
            ))}
        </TreeItem>
    );
};

const BatchesChronology = () => {
    const { useStore } = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const { data: batch } = batchApi.useGetDetail(selectedBatchId);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // useEffect(() => {
    //     if (batch) {
    //         setExpandedItems(getBatchIds(batch as IBatch));
    //     }
    // }, [batch]);

    if (!batch) return null;

    return (
        <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(_, itemIds) => setExpandedItems(itemIds)}
            sx={{ overflowX: 'hidden', width: '100%' }}
        >
            <TreeNode batch={batch as IBatch} />
        </SimpleTreeView>
    );
};

export default BatchesChronology;
import {useState, useEffect, useMemo} from "react";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import dayjs from "dayjs";

interface TreeNodeProps {
    batch: IBatch;
}

const getBatchIds = (batch: IBatch | undefined): string[] => {
    if (!batch) return [];
    const ids: string[] = [];
    const hasChildren = batch.son_batches && Array.isArray(batch.son_batches) && batch.son_batches.length > 0;
    if (hasChildren) {
        ids.push(batch.batch_code);
        batch.son_batches.forEach((son) => {
            if (son.batch) {
                ids.push(...getBatchIds(son.batch));
            }
        });
    }
    return ids;
};

const TreeNode = ({ batch }: TreeNodeProps) => {
    const hasChildren = batch.son_batches && Array.isArray(batch.son_batches) && batch.son_batches.length > 0;

    const random1 = useMemo(() => crypto.getRandomValues(new Uint32Array(1))[0], []);
    const random2 = useMemo(() => crypto.getRandomValues(new Uint32Array(1))[0], []);

    const label = () => (
        <>
            <span style={{fontWeight: 600}}>{`${batch.batch_code}`}</span> {`- (${batch.stock_items}/${batch.pieces}) - ${dayjs(batch.batch_date).format('DD/MM/YYYY')}`}
        </>
    );

    if (!hasChildren) {
        return (
            <TreeItem
                itemId={batch.batch_code + random1}
                label={label()}
            />
        );
    }

    return (
        <TreeItem
            itemId={batch.batch_code + random2}
            label={label()}
        >
            {batch.son_batches.map((son) => {
                if (!son.batch) return null;
                return (
                    <TreeNode
                        key={son.batch.batch_code}
                        batch={son.batch}
                    />
                );
            })}
        </TreeItem>
    );
};

const BatchesChronology = () => {
    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        if (batch) {
            setExpandedItems(getBatchIds(batch as IBatch));
        }
    }, [batch]);

    return (
        <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(_, itemIds) => setExpandedItems(itemIds)}
        >
            {batch && <TreeNode batch={batch as IBatch} />}
        </SimpleTreeView>
    )
};

export default BatchesChronology;
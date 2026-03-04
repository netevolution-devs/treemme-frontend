import {useState, useEffect} from "react";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

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

    if (!hasChildren) {
        return (
            <TreeItem
                itemId={batch.batch_code}
                label={batch.batch_code}
            />
        );
    }

    return (
        <TreeItem
            itemId={batch.batch_code}
            label={batch.batch_code}
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
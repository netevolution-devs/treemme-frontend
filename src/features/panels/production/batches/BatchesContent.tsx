import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";
import {Box} from "@mui/material";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList.tsx";
import BatchesProductionList from "@features/panels/production/batches/production/BatchesProductionList.tsx";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import type {IBatchesStoreParams} from "@features/panels/production/batches/BatchesPanel.tsx";

const BatchesContent = (props: ICustomPanelFormProps<IBatchesStoreParams>) => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 2,
                width: '100%'
            }}>
                <Box sx={{
                    minWidth: '600px',
                    flex: '1 1 600px',
                }}>
                    <BatchesForm {...props}/>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    flex: '1 1 350px',
                    gap: 1,
                    overflow: 'hidden',
                    minWidth: '300px',
                }}>
                    <BatchesCompositionList/>
                </Box>
            </Box>
            <BatchesProductionList/>
        </>
    )
}

export default BatchesContent;
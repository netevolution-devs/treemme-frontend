import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";
import {Box} from "@mui/material";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList.tsx";
import BatchesProductionList from "@features/panels/production/batches/production/BatchesProductionList.tsx";

const BatchesContent = () => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: {sm: 'column', md: 'row'},
                alignItems: 'flex-start',
                gap: 2,
                width: '100%'
            }}>
                <Box sx={{minWidth: 0}}>
                    <BatchesForm/>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: 1,
                    minWidth: 0
                }}>
                    <BatchesCompositionList/>
                </Box>
            </Box>
            <BatchesProductionList/>
        </>
    )
}

export default BatchesContent;
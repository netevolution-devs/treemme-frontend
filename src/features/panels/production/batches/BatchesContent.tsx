import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";
import {Box} from "@mui/material";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList.tsx";
import BatchesProductionList from "@features/panels/production/batches/production/BatchesProductionList.tsx";

const BatchesContent = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: {xs: 'column', xl: 'row'},
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: 2,
            width: '100%'
        }}>
            <Box sx={{flex: '1 1 450px', minWidth: 0}}>
                <BatchesForm/>
            </Box>
            <Box sx={{
                flex: '1 1 600px',
                display: 'flex',
                flexDirection: "column",
                gap: 1,
                minWidth: 0
            }}>
                <BatchesCompositionList/>
                <BatchesProductionList/>
            </Box>
        </Box>
    )
}

export default BatchesContent;
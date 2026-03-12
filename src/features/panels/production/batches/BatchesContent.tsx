import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";
import {Box} from "@mui/material";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList.tsx";
import BatchesProductionList from "@features/panels/production/batches/production/BatchesProductionList.tsx";

const BatchesContent = () => {
    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box>
                <BatchesForm/>
            </Box>
            <Box sx={{display: 'flex', flexDirection: "column", gap: 1, width: "60%"}}>
                <BatchesCompositionList/>
                <BatchesProductionList/>
            </Box>
        </Box>
    )
}

export default BatchesContent;
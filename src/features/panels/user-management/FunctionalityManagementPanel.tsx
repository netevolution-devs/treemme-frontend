import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WorkAreaManagementList from "@features/panels/user-management/WorkAreaManagementList";
import WorkAreaManagementForm from "@features/panels/user-management/WorkAreaManagementForm";
import {Divider, Stack, Typography} from "@mui/material";

export interface IFunctionalityManagementStoreState extends IPanelUIState {
    selectedWorkAreaId?: number | null;
}

const SectionTitle = ({title}: { title: string }) => (
    <>
        <Typography variant="h6">{title}</Typography>
        <Divider sx={{mb: 1}}/>
    </>
);

const FunctionalityManagementPanel = () => {
    const initialUiState: IFunctionalityManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFunctionalityManagementStoreState>
            kind={"functionality-management"}
            initialState={{uiState: initialUiState}}
        >
            <Stack spacing={4} sx={{p: 2}}>
                <div><SectionTitle title="Funzionalità"/><WorkAreaManagementList/><WorkAreaManagementForm/></div>
            </Stack>
        </GenericPanel>
    )
}

export default FunctionalityManagementPanel;

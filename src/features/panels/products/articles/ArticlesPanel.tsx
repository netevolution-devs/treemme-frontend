import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IArticlesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ArticlesPanel = () => {
    const initialUiState: IArticlesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticlesStoreState>
            kind={"articles"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Articles</div>
            <div>Form placeholder for Articles</div>
        </GenericPanel>
    )
}

export default ArticlesPanel;

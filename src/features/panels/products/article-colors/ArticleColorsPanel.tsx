import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IArticleColorsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ArticleColorsPanel = () => {
    const initialUiState: IArticleColorsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleColorsStoreState>
            kind={"articleColors"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for ArticleColors</div>
            <div>Form placeholder for ArticleColors</div>
        </GenericPanel>
    )
}

export default ArticleColorsPanel;

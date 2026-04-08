import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IArticleInternalColorsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ArticleInternalColorsPanel = () => {
    const initialUiState: IArticleInternalColorsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleInternalColorsStoreState>
            kind={"articleInternalColors"}
            initialState={{uiState: initialUiState}}
            listComponent={<div>List placeholder for ArticleInternalColors</div>}
        >
            <div>Form placeholder for ArticleInternalColors</div>
        </GenericPanel>
    )
}

export default ArticleInternalColorsPanel;

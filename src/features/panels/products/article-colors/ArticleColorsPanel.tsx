import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticleColorsList from "@features/panels/products/article-colors/ArticleColorsList.tsx";
import ArticleColorsForm from "@features/panels/products/article-colors/ArticleColorsForm.tsx";

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
            <ArticleColorsList/>
            <ArticleColorsForm/>
        </GenericPanel>
    )
}

export default ArticleColorsPanel;

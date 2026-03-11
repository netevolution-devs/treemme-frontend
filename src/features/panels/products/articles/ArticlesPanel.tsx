import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticlesForm from "@features/panels/products/articles/ArticlesForm.tsx";
import ArticleList from "@features/panels/products/articles/ArticleList.tsx";

export interface IArticlesStoreState extends IPanelUIState {
    selectedArticledId?: number | null;
}

const ArticlesPanel = () => {
    const initialUiState: IArticlesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticlesStoreState>
            kind={"articles"}
            initialState={{uiState: initialUiState}}
        >
            <ArticlesForm/>
            <ArticleList/>
        </GenericPanel>
    )
}

export default ArticlesPanel;

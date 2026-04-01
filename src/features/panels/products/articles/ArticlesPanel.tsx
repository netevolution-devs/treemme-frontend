import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticlesForm from "@features/panels/products/articles/ArticlesForm.tsx";
import ArticleList from "@features/panels/products/articles/ArticleList.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IArticlesStoreState extends IPanelUIState {
    selectedArticledId?: number | null;
}

export interface IArticleStoreParams {
    clientId?: number;
}

const ArticlesPanel = (props: IDockviewPanelProps<ICustomPanelProps<IArticleStoreParams>>) => {
    const initialUiState: IArticlesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticlesStoreState>
            kind={"articles"}
            initialState={{uiState: initialUiState}}
        >
            <ArticleList/>
            <ArticlesForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticlesPanel;

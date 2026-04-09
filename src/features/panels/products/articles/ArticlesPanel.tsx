import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ArticlesForm from "@features/panels/products/articles/ArticlesForm";
import ArticleList from "@features/panels/products/articles/ArticleList";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

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
            listComponent={<ArticleList/>}
        >
            <ArticlesForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticlesPanel;

import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ArticleInternalColorsList from "@features/panels/products/article-internal-colors/ArticleInternalColorsList";
import ArticleInternalColorsForm from "@features/panels/products/article-internal-colors/ArticleInternalColorsForm";

export interface IArticleInternalColorsStoreFilter {
    filterName?: string;
}

export interface IArticleInternalColorsStoreParams {
    id?: number;
}

export interface IArticleInternalColorsStoreState extends IPanelUIState {
    selectedId: number | null;
}

const ArticleInternalColorsPanel = () => {
    const initialUiState: IArticleInternalColorsStoreState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState,
        selectedId: null
    };

    return (
        <GenericPanel<IArticleInternalColorsStoreFilter, IArticleInternalColorsStoreState, IArticleInternalColorsStoreParams>
            kind={"articleInternalColors"}
            initialState={{
                uiState: initialUiState,
                filters: {filterName: ""}
            }}
            listComponent={<ArticleInternalColorsList/>}
        >
            <ArticleInternalColorsForm/>
        </GenericPanel>
    )
}

export default ArticleInternalColorsPanel;

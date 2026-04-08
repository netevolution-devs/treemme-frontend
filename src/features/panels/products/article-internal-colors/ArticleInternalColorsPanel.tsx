import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ArticleInternalColorsList from "@features/panels/products/article-internal-colors/ArticleInternalColorsList";
import ArticleInternalColorsForm from "@features/panels/products/article-internal-colors/ArticleInternalColorsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IArticleInternalColorsStoreParams {
    id?: number;
}

export interface IArticleInternalColorsStoreState extends IPanelUIState {
    selectedInternalColorId?: number | null;
}

const ArticleInternalColorsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IArticleInternalColorsStoreState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState,
    };

    return (
        <GenericPanel<unknown, IArticleInternalColorsStoreState>
            kind={"articleInternalColors"}
            initialState={{
                uiState: initialUiState,
                filters: {filterName: ""}
            }}
            listComponent={<ArticleInternalColorsList/>}
        >
            <ArticleInternalColorsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticleInternalColorsPanel;

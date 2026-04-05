import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import type {IDockviewPanelProps} from "dockview";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ArticleTypesList from "@features/panels/products/article-types/ArticleTypesList";
import ArticleTypesForm from "@features/panels/products/article-types/ArticleTypesForm";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IArticleTypesStoreState extends IPanelUIState {
    selectedArticleTypeId?: number | null;
}

const ArticleTypesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IArticleTypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleTypesStoreState>
            kind={"articleTypes"}
            initialState={{uiState: initialUiState}}
            listComponent={<ArticleTypesList/>}
        >
            <ArticleTypesForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticleTypesPanel;

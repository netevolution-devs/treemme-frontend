import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ArticleClassesList from "@features/panels/products/article-classes/ArticleClassesList";
import ArticleClassesForm from "@features/panels/products/article-classes/ArticleClassesForm";

export interface IArticleClassesStoreState extends IPanelUIState {
    selectedArticleClassId?: number | null;
}

const ArticleClassesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IArticleClassesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleClassesStoreState>
            kind={"articleClasses"}
            initialState={{uiState: initialUiState}}
            listComponent={<ArticleClassesList/>}
        >
            <ArticleClassesForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticleClassesPanel;

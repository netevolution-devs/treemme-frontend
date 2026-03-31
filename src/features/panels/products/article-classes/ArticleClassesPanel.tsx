import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import ArticleClassesList from "@features/panels/products/article-classes/ArticleClassesList.tsx";
import ArticleClassesForm from "@features/panels/products/article-classes/ArticleClassesForm.tsx";

export interface IArticleClassesStoreState extends IPanelUIState {
    selectedArticleClassId?: number | null;
}

const ArticleClassesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IArticleClassesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleClassesStoreState>
            kind={"articleClasses"}
            initialState={{uiState: initialUiState}}
        >
            <ArticleClassesList/>
            <ArticleClassesForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticleClassesPanel;

import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import type {IDockviewPanelProps} from "dockview";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticleTypesList from "@features/panels/products/article-types/ArticleTypesList.tsx";
import ArticleTypesForm from "@features/panels/products/article-types/ArticleTypesForm.tsx";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

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

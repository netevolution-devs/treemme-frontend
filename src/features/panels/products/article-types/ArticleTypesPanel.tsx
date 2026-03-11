import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import type {IDockviewPanelProps} from "dockview";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticleTypesList from "@features/panels/products/article-types/ArticleTypesList.tsx";
import ArticleTypesForm from "@features/panels/products/article-types/ArticleTypesForm.tsx";

export interface IArticleTypePanelProps {
    onSuccess: () => void;
    initialName: string;
}

export interface IArticleTypesStoreState extends IPanelUIState {
    selectedArticleTypeId?: number | null;
}

const ArticleTypesPanel = (props: IDockviewPanelProps<IArticleTypePanelProps>) => {
    const initialUiState: IArticleTypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleTypesStoreState>
            kind={"articleTypes"}
            initialState={{uiState: initialUiState}}
        >
            <ArticleTypesList/>
            <ArticleTypesForm 
                initialName={props.params?.initialName}
                onSuccess={props.params?.onSuccess}
            />
        </GenericPanel>
    )
}

export default ArticleTypesPanel;

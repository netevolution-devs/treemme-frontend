import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ArticleColorsList from "@features/panels/products/article-colors/ArticleColorsList.tsx";
import ArticleColorsForm from "@features/panels/products/article-colors/ArticleColorsForm.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IArticleColorsStoreState extends IPanelUIState {
    selectedColorId?: number | null;
}

export interface IArticleColorsStoreFilter {
    filterClientId?: number;
}

export interface IArticleColorsStoreParams {
    client_id?: number;
}

const ArticleColorsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IArticleColorsStoreParams>>) => {
    const initialUiState: IArticleColorsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IArticleColorsStoreState>
            kind={"articleColors"}
            initialState={{uiState: initialUiState}}
        >
            <ArticleColorsList/>
            <ArticleColorsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticleColorsPanel;

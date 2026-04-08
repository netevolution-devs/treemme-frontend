import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ArticlePrintsList from "@features/panels/products/article-prints/ArticlePrintsList";
import ArticlePrintsForm from "@features/panels/products/article-prints/ArticlePrintsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IArticlePrintsStoreState extends IPanelUIState {
    selectedPrintId?: number | null;
}

const ArticlePrintsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IArticlePrintsStoreState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState,
    };

    return (
        <GenericPanel<unknown, IArticlePrintsStoreState>
            kind={"articlePrints"}
            initialState={{
                uiState: initialUiState,
            }}
            listComponent={<ArticlePrintsList/>}
        >
            <ArticlePrintsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ArticlePrintsPanel;

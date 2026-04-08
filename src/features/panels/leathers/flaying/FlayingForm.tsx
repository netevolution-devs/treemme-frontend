import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type IFlayingForm = Omit<IFlay, 'id'>;

const FlayingForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedFlayId = useStore((state) => state.uiState.selectedFlayId);
    const setUIState = useStore((state) => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedFlayId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = flayApi;
    const {data: flayItem} = useGetDetail(selectedFlayId);
    const {mutateAsync: createFlay, isPending: isPosting} = usePost();
    const {mutateAsync: updateFlay, isPending: isPutting} = usePut();
    const {mutateAsync: deleteFlay, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IFlayingForm, IFlay, IFlayingStoreState>
            resource="pellami - scuoiature"
            onSuccess={handlePanelSuccess}
            selectedId={selectedFlayId}
            entity={flayItem}
            emptyValues={{
                code: '',
                name: initialName ?? ''
            }}
            mapEntityToForm={(x) => ({
                code: x.code,
                name: x.name
            })}
            create={(payload) => createFlay(payload)}
            update={(id, payload) => updateFlay({id, payload})}
            remove={(id) => deleteFlay(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedFlayId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code}
            renderFields={() => (
                <>
                    <TextFieldControlled<IFlayingForm>
                        name={"code"}
                        label={t("leathers.flay.code")}
                        required
                    />
                    <TextFieldControlled<IFlayingForm>
                        name={"name"}
                        label={t("leathers.flay.name")}
                        required
                    />
                </>
            )}

        />
    )
}

export default FlayingForm;
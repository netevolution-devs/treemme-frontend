import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel.tsx";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi.ts";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type IFlayingForm = Omit<IFlay, 'id'>;

const FlayingForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedFlayId = useStore((state) => state.uiState.selectedFlayId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = flayApi;
    const {data: flayItem} = useGetDetail(selectedFlayId);
    const {mutateAsync: createFlay, isPending: isPosting} = usePost();
    const {mutateAsync: updateFlay, isPending: isPutting} = usePut();
    const {mutateAsync: deleteFlay, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IFlayingForm, IFlay, IFlayingStoreState>
            selectedId={selectedFlayId}
            entity={flayItem}
            emptyValues={{
                code: '',
                name: ''
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
                    />
                    <TextFieldControlled<IFlayingForm>
                        name={"name"}
                        label={t("leathers.flay.name")}
                    />
                </>
            )}

        />
    )
}

export default FlayingForm;
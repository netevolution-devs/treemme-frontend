import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type IProvinceForm = Omit<IProvince, 'id'>;

const ProvinceForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const selectedProvinceId = useStore(state => state.uiState.selectedProvinceId);
    const setUIState = useStore(state => state.setUIState);

    const { useGetDetail, usePost, usePut, useDelete } = provinceApi;
    const {data: province} = useGetDetail(selectedProvinceId);
    const {mutateAsync: createProvince, isPending: isPosting} = usePost();
    const {mutateAsync: updateProvince, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProvince, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IProvinceForm, IProvince, IProvinceStoreState>
            selectedId={selectedProvinceId}
            entity={province}
            emptyValues={{ acronym: '', name: '' }}
            mapEntityToForm={(p) => ({ acronym: p.acronym, name: p.name })}
            create={(payload) => createProvince(payload)}
            update={(id, payload) => updateProvince({ id, payload })}
            remove={(id) => deleteProvince(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedProvinceId: null })}
            validateBeforeSave={(v) => !!v.acronym && !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<IProvinceForm>
                        name="acronym"
                        label={t("province.acronym")}
                    />
                    <TextFieldControlled<IProvinceForm>
                        name="name"
                        label={t("province.name")}
                    />
                </>
            )}
        />
    );
};

export default ProvinceForm;
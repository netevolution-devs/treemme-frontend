import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type IProvinceForm = Omit<IProvince, 'id'>;

const ProvinceForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const selectedProvinceId = useStore(state => state.uiState.selectedProvinceId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedProvinceId,
        onSuccess,
        setFormState
    });

    const { useGetDetail, usePost, usePut, useDelete } = provinceApi;
    const {data: province} = useGetDetail(selectedProvinceId);
    const {mutateAsync: createProvince, isPending: isPosting} = usePost();
    const {mutateAsync: updateProvince, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProvince, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IProvinceForm, IProvince, IProvinceStoreState>
            resource="contatti - province"
            onSuccess={handlePanelSuccess}
            selectedId={selectedProvinceId}
            entity={province}
            emptyValues={{ acronym: '', name: initialName ?? '' }}
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
                        required
                    />
                    <TextFieldControlled<IProvinceForm>
                        name="name"
                        label={t("province.name")}
                        required
                    />
                </>
            )}
        />
    );
};

export default ProvinceForm;
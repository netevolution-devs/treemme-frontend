import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ISpeciesStoreState} from "@features/panels/leathers/species/SpeciesPanel";
import {speciesApi} from "@features/panels/leathers/species/api/speciesApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";

export type ISpeciesForm = Omit<ISpecies, 'id'>;

const SpeciesForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISpeciesStoreState>();
    const selectedSpeciesId = useStore((state) => state.uiState.selectedSpeciesId);
    const setUIState = useStore((state) => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedSpeciesId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = speciesApi;
    const {data: speciesItem} = useGetDetail(selectedSpeciesId);
    const {mutateAsync: createSpecies, isPending: isPosting} = usePost();
    const {mutateAsync: updateSpecies, isPending: isPutting} = usePut();
    const {mutateAsync: deleteSpecies, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ISpeciesForm, ISpecies, ISpeciesStoreState>
            resource="pellami - specie"
            onSuccess={handlePanelSuccess}
            selectedId={selectedSpeciesId}
            entity={speciesItem}
            emptyValues={{
                code: '',
                name: initialName ?? ''
            }}
            mapEntityToForm={(x) => ({
                code: x.code,
                name: x.name
            })}
            create={(payload) => createSpecies(payload)}
            update={(id, payload) => updateSpecies({id, payload})}
            remove={(id) => deleteSpecies(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedSpeciesId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code}
            renderFields={() => (
                <>
                    <TextFieldControlled<ISpeciesForm>
                        name={"code"}
                        label={t("leathers.species.code")}
                        required
                    />
                    <TextFieldControlled<ISpeciesForm>
                        name={"name"}
                        label={t("leathers.species.name")}
                        required
                    />
                </>
            )}
        />
    );
}

export default SpeciesForm;
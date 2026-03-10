import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ISpeciesStoreState} from "@features/panels/leathers/species/SpeciesPanel.tsx";
import {speciesApi} from "@features/panels/leathers/species/api/speciesApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type ISpeciesForm = Omit<ISpecies, 'id'>;

const SpeciesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISpeciesStoreState>();
    const selectedSpeciesId = useStore((state) => state.uiState.selectedSpeciesId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = speciesApi;
    const {data: speciesItem} = useGetDetail(selectedSpeciesId);
    const {mutateAsync: createSpecies, isPending: isPosting} = usePost();
    const {mutateAsync: updateSpecies, isPending: isPutting} = usePut();
    const {mutateAsync: deleteSpecies, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ISpeciesForm, ISpecies, ISpeciesStoreState>
            selectedId={selectedSpeciesId}
            entity={speciesItem}
            emptyValues={{
                code: '',
                name: ''
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
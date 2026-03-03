import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IThicknessesStoreState} from "@features/panels/leathers/thicknesses/ThicknessesPanel.tsx";
import {type IThicknessPayload, thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";

export type IThicknessForm = Omit<IThickness, "id" | "thickness_mm"> & {
    thickness_mm: number | null;
};

const ThicknessesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IThicknessesStoreState>();
    const selectedThicknessId = useStore(state => state.uiState.selectedThicknessId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = thicknessApi;
    const {data: thickness} = useGetDetail(selectedThicknessId);
    const {mutateAsync: createThickness, isPending: isPosting} = usePost();
    const {mutateAsync: updateThickness, isPending: isPutting} = usePut();
    const {mutateAsync: deleteThickness, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IThicknessForm, IThickness, IThicknessesStoreState>
            selectedId={selectedThicknessId}
            entity={thickness}
            emptyValues={{
                name: "",
                thickness_mm: null
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                thickness_mm: x.thickness_mm
            })}
            create={(payload) => createThickness(payload as IThicknessPayload)}
            update={(id, payload) => updateThickness({id, payload: payload as IThicknessPayload})}
            remove={(id) => deleteThickness(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedThicknessId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.thickness_mm}
            renderFields={() => (
                <>
                    <TextFieldControlled<IThicknessForm>
                        name={"name"}
                        label={t("leathers.thickness.name")}
                    />
                    <NumberFieldControlled<IThicknessForm>
                        name={"thickness_mm"}
                        label={t("leathers.thickness.mm")}
                        step={0.05}
                    />
                </>
            )}
        />
    )
}

export default ThicknessesForm;
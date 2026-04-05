import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ITypesStoreState} from "@features/panels/leathers/types/TypesPanel";
import {type ILeatherTypePayload, leatherTypeApi} from "@features/panels/leathers/types/api/leatherTypeApi";
import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType";
import GenericForm from "@features/panels/shared/GenericForm";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {Box} from "@mui/material";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import useSubscribePanel from "@ui/panel/useSubscribePanel";
import type {ILeatherForm} from "@features/panels/leathers/leathers/LeathersForm";
import useCallablePanel from "@ui/panel/useCallablePanel";

export type ITypeForm = Omit<ILeatherType, "id" | "thickness"> & {
    thickness_id: number | null;
};

const TypesForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {useStore} = usePanel<unknown, ITypesStoreState>();
    const selectedTypeId = useStore(state => state.uiState.selectedTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedTypeId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = leatherTypeApi;
    const {data: type} = useGetDetail(selectedTypeId);
    const {mutateAsync: createType, isPending: isPosting} = usePost();
    const {mutateAsync: updateType, isPending: isPutting} = usePut();
    const {mutateAsync: deleteType, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ITypeForm, ILeatherType, ITypesStoreState>
            resource="pellami - tipologie"
            onSuccess={handlePanelSuccess}
            selectedId={selectedTypeId}
            entity={type}
            emptyValues={{
                name: initialName ?? '',
                code: '',
                thickness_id: null,
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                code: x.code,
                thickness_id: x.thickness?.id || null
            })}
            create={(payload) => createType(payload as ILeatherTypePayload)}
            update={(id, payload) => updateType({id, payload: payload as ILeatherTypePayload})}
            remove={(id) => deleteType(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedTypeId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code && !!v.thickness_id}
            renderFields={() => <TypesFormFields/>}
        />
    )
}

const TypesFormFields = () => {
    const {t} = useTranslation(["form"]);

    const {data: thicknesses = []} = thicknessApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();
    useSubscribePanel<ILeatherForm>({
        formKey: "thickness_id",
        dependencyKey: "thicknesses"
    });

    return (
        <>
            <Box sx={{display: 'flex', gap: 1}}>
                <TextFieldControlled<ITypeForm>
                    name={"code"}
                    label={t("leathers.type.code")}
                    required
                />
                <TextFieldControlled<ITypeForm>
                    name={"name"}
                    label={t("leathers.type.name")}
                    required
                />
            </Box>
            <SelectFieldControlled<ITypeForm>
                name={"thickness_id"}
                label={t("leathers.leather.thickness")}
                options={thicknesses.map((x) => ({
                    label: x.name,
                    value: x.id
                }))}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "thicknesses",
                            i18nKey: "menu.leathers.thicknesses",
                        }
                    })
                }}
            />
        </>
    )
}

export default TypesForm;
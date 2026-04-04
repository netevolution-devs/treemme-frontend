import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IOriginsStoreState} from "@features/panels/leathers/origins/OriginsPanel.tsx";
import {originApi, type IOriginPayload} from "@features/panels/leathers/origins/api/originApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IOrigin} from "@features/panels/leathers/origins/api/IOrigin.ts";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi.ts";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {Box, Typography} from "@mui/material";
import {originAreaApi} from "@features/panels/leathers/origins/api/origin-area/originAreaApi.ts";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import useSubscribePanel from "@ui/panel/useSubscribePanel.ts";
import type {ILeatherForm} from "@features/panels/leathers/leathers/LeathersForm.tsx";

export type IOriginForm =
    Omit<IOrigin, "id"
        | "nation"
        | "flay"
        | "area"
        | "psp_yield_coefficient"
        | "crust_yield_coefficient"
        | "grain_yield_coefficient"
        | "trip_day"
        | "sea_shipment"
        | "raw_yield_coefficient"
        | "rind_yield_coefficient"
> & {
    nation_id?: number | null;
    flay_id?: number | null;
    area_id?: number | null;
    trip_day?: number | null;
    sea_shipment?: boolean;
    psp_yield_coefficient?: number | null;
    raw_yield_coefficient?: number | null;
    grain_yield_coefficient?: number | null;
    crust_yield_coefficient?: number | null;
    rind_yield_coefficient?: number | null;
};

const OriginsForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {useStore} = usePanel<unknown, IOriginsStoreState>();
    const selectedOriginId = useStore(state => state.uiState.selectedOriginId);
    const isFormDisabled = useStore(state => state.uiState.isFormDisabled);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedOriginId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = originApi;
    const {data: origin} = useGetDetail(selectedOriginId);
    const {mutateAsync: createOrigin, isPending: isPosting} = usePost();
    const {mutateAsync: updateOrigin, isPending: isPutting} = usePut();
    const {mutateAsync: deleteOrigin, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IOriginForm, IOrigin, IOriginsStoreState>
            resource="pellami - provenienze"
            onSuccess={handlePanelSuccess}
            selectedId={selectedOriginId}
            entity={origin}
            emptyValues={{
                code: "",
                area_id: null,
                nation_id: null,
                flay_id: null,
                crust_yield_coefficient: 1,
                grain_yield_coefficient: 1,
                psp_yield_coefficient: 1,
                raw_yield_coefficient: 1,
                rind_yield_coefficient: 1,
                sea_shipment: false,
                trip_day: null,
            }}
            mapEntityToForm={(x) => ({
                code: x.code,
                area_id: x.area.id,
                nation_id: x.nation.id,
                flay_id: x.flay.id,
                crust_yield_coefficient: x.crust_yield_coefficient,
                grain_yield_coefficient: x.grain_yield_coefficient,
                psp_yield_coefficient: x.psp_yield_coefficient,
                raw_yield_coefficient: x.raw_yield_coefficient,
                rind_yield_coefficient: x.rind_yield_coefficient,
                sea_shipment: x.sea_shipment,
                trip_day: x.trip_day,
            })}
            create={(payload) => createOrigin(payload as IOriginPayload)}
            update={(id, payload) => updateOrigin({id, payload: payload as IOriginPayload})}
            remove={(id) => deleteOrigin(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedOriginId: null})}
            validateBeforeSave={(v) =>
                !!v.code &&
                !!v.area_id &&
                !!v.nation_id &&
                !!v.flay_id &&
                !!v.psp_yield_coefficient &&
                !!v.crust_yield_coefficient &&
                !!v.grain_yield_coefficient &&
                !!v.rind_yield_coefficient &&
                !!v.raw_yield_coefficient
            }
            renderFields={() => <OriginsFormFields isFormDisabled={isFormDisabled}/>}
        />
    )
}

const OriginsFormFields = ({isFormDisabled}: {isFormDisabled: boolean}) => {
    const {t} = useTranslation(["form"]);

    const {data: nations = []} = nationsApi.useGetList();
    const {data: areas = []} = originAreaApi.useGetList();
    const {data: flays = []} = flayApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IOriginForm>({
        formKey: "nation_id",
        dependencyKey: "nations"
    });
    useSubscribePanel<IOriginForm>({
        formKey: "flay_id",
        dependencyKey: "flaying"
    });

    return (
        <>
            <Box sx={{display: 'flex', gap: 1}}>
                <TextFieldControlled<IOriginForm>
                    name="code"
                    label={t("leathers.origin.code")}
                    required
                />
                <NumberFieldControlled<IOriginForm>
                    name="trip_day"
                    label={t("leathers.origin.trip-day")}
                    step={1}
                    precision={0}
                    maxWidth="200px"
                />
                <FlagCheckBoxFieldControlled<IOriginForm>
                    name="sea_shipment"
                    label={t("leathers.origin.sea-shipment")}
                />
            </Box>
            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IOriginForm>
                    name="nation_id"
                    label={t("nations.name")}
                    options={nations.map(n => ({value: n.id, label: n.name}))}
                    minWidth={"49.6%"}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "nations",
                                i18nKey: "menu.contacts.nations",
                            }
                        })
                    }}
                />
                <SelectFieldControlled<IOriginForm>
                    name="area_id"
                    label={t("leathers.origin.area")}
                    options={areas.map(n => ({value: n.id, label: n.name}))}
                    minWidth={"50%"}
                    required
                />
            </Box>
            <SelectFieldControlled<ILeatherForm>
                name={"flay_id"}
                label={t("leathers.leather.flay")}
                options={flays.map((x) => ({
                    label: x.name,
                    value: x.id
                }))}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "flaying",
                            i18nKey: "menu.leathers.flaying",
                        }
                    })
                }}
            />
            <Typography sx={{mb: 1, fontSize: 16}} color={isFormDisabled ? "textDisabled" : "textPrimary"}>{t("leathers.origin.label-coeff")}</Typography>
            <Box sx={{display: 'flex', gap: 1}}>
                <NumberFieldControlled<IOriginForm>
                    name="psp_yield_coefficient"
                    label={t("leathers.origin.psp-yield-coefficient")}
                    precision={3}
                    step={1}
                    required
                />
                <NumberFieldControlled<IOriginForm>
                    name="grain_yield_coefficient"
                    label={t("leathers.origin.grain-yield-coefficient")}
                    precision={3}
                    step={1}
                    required
                />
                <NumberFieldControlled<IOriginForm>
                    name="crust_yield_coefficient"
                    label={t("leathers.origin.crust-yield-coefficient")}
                    precision={3}
                    step={1}
                    required
                />
                <NumberFieldControlled<IOriginForm>
                    name="raw_yield_coefficient"
                    label={t("leathers.origin.raw-yield-coefficient")}
                    precision={3}
                    step={1}
                    required
                />
                <NumberFieldControlled<IOriginForm>
                    name="rind_yield_coefficient"
                    label={t("leathers.origin.rind-yield-coefficient")}
                    precision={3}
                    step={1}
                    required
                />
            </Box>
        </>
    )
}

export default OriginsForm;
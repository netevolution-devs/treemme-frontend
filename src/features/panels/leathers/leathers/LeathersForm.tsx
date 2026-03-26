import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILeathersStoreState, ILeatherStoreParams} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import {leatherApi} from "@features/panels/leathers/leathers/api/leatherApi.ts";
import {speciesApi} from "@features/panels/leathers/species/api/speciesApi.ts";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi.ts";
import {originApi} from "@features/panels/leathers/origins/api/originApi.ts";
import {tanningStageApi} from "@features/panels/leathers/tanning-stages/api/tanningStageApi.ts";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi.ts";
import {leatherTypeApi} from "@features/panels/leathers/types/api/leatherTypeApi.ts";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {Box} from "@mui/material";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import {weightApi} from "@features/panels/leathers/weights/api/weightApi.ts";
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import useSubscribePanel from "@ui/panel/useSubscribePanel.ts";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {useEffect} from "react";

export type ILeatherForm = Omit<ILeather, "id"
    | "contact"
    | "weight"
    | "thickness"
    | "flay"
    | "status"
    | "provenance"
    | "species"
    | "type"
    | "code"
    | "name"
    | "sqft_leather_min"
    | "sqft_leather_max"
    | "sqft_leather_media"
    | "sqft_leather_expected"
    | "kg_leather_min"
    | "kg_leather_max"
    | "kg_leather_media"
    | "kg_leather_expected"
    | "supplier"
    | "container_piece"
    | "crust_revenue_expected"
> & {
    supplier_id: number | null;
    weight_id: number | null;
    thickness_id: number | null;
    flay_id: number | null;
    status_id: number | null;
    provenance_id: number | null;
    species_id: number | null;
    type_id: number | null;
    sqft_leather_expected?: number | null;
    kg_leather_expected?: number | null;
    container_piece?: number | null;
    crust_revenue_expected?: number | null;
};

const LeathersForm = ({extra}: ICustomPanelFormProps<ILeatherStoreParams>) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ILeathersStoreState>();
    const selectedLeatherId = useStore(state => state.uiState.selectedLeatherId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = leatherApi;
    const {data: leather} = useGetDetail(selectedLeatherId);
    const {mutateAsync: createLeather, isPending: isPosting} = usePost();
    const {mutateAsync: updateLeather, isPending: isPutting} = usePut();
    const {mutateAsync: deleteLeather, isPending: isDeleting} = useDelete();

    useEffect(() => {
        if (extra?.leatherId) {
            setUIState({selectedLeatherId: extra.leatherId});
        }
    }, [extra]);

    return (
        <GenericForm<ILeatherForm, ILeather, ILeathersStoreState>
            selectedId={selectedLeatherId}
            entity={leather}
            emptyValues={{
                supplier_id: null,
                weight_id: null,
                species_id: null,
                thickness_id: null,
                flay_id: null,
                type_id: null,
                provenance_id: null,
                status_id: null,
                sqft_leather_expected: null,
                kg_leather_expected: null,
                statistic_update: true,
                container_piece: null,
                crust_revenue_expected: null,
            }}
            mapEntityToForm={(x) => ({
                supplier_id: x.supplier?.id || null,
                weight_id: x.weight?.id || null,
                species_id: x.species?.id || null,
                thickness_id: x.thickness?.id || null,
                flay_id: x.flay?.id || null,
                type_id: x.type?.id || null,
                provenance_id: x.provenance?.id || null,
                status_id: x.status?.id || null,
                sqft_leather_expected: x.sqft_leather_expected,
                kg_leather_expected: x.kg_leather_expected,
                statistic_update: x.statistic_update,
                container_piece: x.container_piece,
                crust_revenue_expected: x.crust_revenue_expected,
            })}
            create={(payload) => createLeather(payload)}
            update={(id, payload) => updateLeather({id, payload})}
            remove={(id) => deleteLeather(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedLeatherId: null})}
            validateBeforeSave={(v) => !!v.weight_id && !!v.species_id && !!v.thickness_id && !!v.flay_id && !!v.type_id && !!v.provenance_id && !!v.status_id}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mb: 1}}>
                        <TextFieldValue
                            label={t("leathers.leather.code")}
                            value={leather?.code}
                            isFilled={!!selectedLeatherId}
                        />
                        <TextFieldValue
                            label={t("leathers.leather.name")}
                            value={leather?.name}
                            isFilled={!!selectedLeatherId}
                        />
                        {/*<FlagCheckBoxFieldControlled<ILeatherForm>*/}
                        {/*    name={"statistic_update"}*/}
                        {/*    label={t("leathers.leather.statistic_update")}*/}
                        {/*/>*/}
                    </Box>

                    {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mb: 1}}>*/}
                    {/*    <Box>*/}
                    {/*        <Typography*/}
                    {/*            color={!isFormDisabled ? "text.primary" : "textDisabled"}*/}
                    {/*            sx={{mb: 0.4}}>{t("leathers.leather.sqft-label")}</Typography>*/}
                    {/*        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-min")}*/}
                    {/*                value={leather?.sqft_leather_min}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.sqft_leather_min}*/}
                    {/*            />*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-max")}*/}
                    {/*                value={leather?.sqft_leather_max}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.sqft_leather_max}*/}
                    {/*            />*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-avg")}*/}
                    {/*                value={leather?.sqft_leather_media}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.sqft_leather_media}*/}
                    {/*            />*/}
                    {/*        </Box>*/}
                    {/*    </Box>*/}
                    {/*    <Box>*/}
                    {/*        <Typography*/}
                    {/*            color={!isFormDisabled ? "text.primary" : "textDisabled"}*/}
                    {/*            sx={{mb: 0.4}}>{t("leathers.leather.kg-label")}</Typography>*/}
                    {/*        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-min")}*/}
                    {/*                value={leather?.kg_leather_min}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.kg_leather_min}*/}
                    {/*            />*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-max")}*/}
                    {/*                value={leather?.kg_leather_max}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.kg_leather_max}*/}
                    {/*            />*/}
                    {/*            <TextFieldValue*/}
                    {/*                label={t("leathers.leather.leather-avg")}*/}
                    {/*                value={leather?.kg_leather_media}*/}
                    {/*                isFilled={!!selectedLeatherId && !!leather?.kg_leather_media}*/}
                    {/*            />*/}
                    {/*        </Box>*/}
                    {/*    </Box>*/}
                    {/*</Box>*/}
                    <LeatherSelects/>
                    {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                    {/*    <NumberFieldControlled<ILeatherForm>*/}
                    {/*        name={"sqft_leather_expected"}*/}
                    {/*        label={t("leathers.leather.sqft-leather-expected")}*/}
                    {/*        maxWidth={"200px"}*/}
                    {/*    />*/}
                    {/*    <NumberFieldControlled<ILeatherForm>*/}
                    {/*        name={"kg_leather_expected"}*/}
                    {/*        label={t("leathers.leather.kg-leather-expected")}*/}
                    {/*        maxWidth={"200px"}*/}
                    {/*    />*/}
                    {/*    <NumberFieldControlled<ILeatherForm>*/}
                    {/*        name={"container_piece"}*/}
                    {/*        label={t("leathers.leather.container-piece")}*/}
                    {/*        precision={0}*/}
                    {/*    />*/}
                    {/*</Box>*/}
                </>
            )}
        />
    )
}

const LeatherSelects = () => {
    const {t} = useTranslation(["form"]);

    const {data: suppliers = []} = contactsApi.useGetList({queryParams: {type: "supplier"}});
    const {data: origins = []} = originApi.useGetList();

    const {data: species = []} = speciesApi.useGetList();
    const {data: types = []} = leatherTypeApi.useGetList();
    const {data: tanningStages = []} = tanningStageApi.useGetList();
    const {data: weights = []} = weightApi.useGetList();
    const {data: thicknesses = []} = thicknessApi.useGetList();
    const {data: flays = []} = flayApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<ILeatherForm>({
        formKey: "supplier_id",
        dependencyKey: "contacts"
    })
    useSubscribePanel<ILeatherForm>({
        formKey: "provenance_id",
        dependencyKey: "origins"
    })
    useSubscribePanel<ILeatherForm>({
        formKey: "species_id",
        dependencyKey: "species"
    });
    useSubscribePanel<ILeatherForm>({
        formKey: "type_id",
        dependencyKey: "types"
    });
    useSubscribePanel<ILeatherForm>({
        formKey: "status_id",
        dependencyKey: "tanningStages"
    });
    useSubscribePanel<ILeatherForm>({
        formKey: "weight_id",
        dependencyKey: "weights"
    });
    useSubscribePanel<ILeatherForm>({
        formKey: "thickness_id",
        dependencyKey: "thicknesses"
    });
    useSubscribePanel<ILeatherForm>({
        formKey: "flay_id",
        dependencyKey: "flaying"
    });

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<ILeatherForm>
                    name={"supplier_id"}
                    label={t("leathers.leather.contact")}
                    options={suppliers.map((x) => ({
                        label: x.name,
                        value: x.id
                    }))}
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            extra: {
                                supplier: true
                            },
                            initialValue: input,
                            menu: {
                                component: "contacts",
                                i18nKey: "menu.contacts.contacts"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<ILeatherForm>
                    name={"provenance_id"}
                    label={t("leathers.leather.origin")}
                    options={origins.map((x) => ({
                        label: `${x.nation.name} - ${x.area?.name ?? ''}`,
                        value: x.id
                    }))}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "origins",
                                i18nKey: "menu.leathers.origins"
                            }
                        })
                    }}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<ILeatherForm>
                    name={"species_id"}
                    label={t("leathers.leather.species")}
                    options={species.map((x) => ({
                        label: x.name,
                        value: x.id
                    }))}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "species",
                                i18nKey: "menu.leathers.species"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<ILeatherForm>
                    name={"type_id"}
                    label={t("leathers.leather.type")}
                    options={types.map((x) => ({
                        label: x.name,
                        value: x.id
                    }))}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "types",
                                i18nKey: "menu.leathers.types"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<ILeatherForm>
                    name={"status_id"}
                    label={t("leathers.leather.status")}
                    options={tanningStages.map((x) => ({
                        label: x.name,
                        value: x.id
                    }))}
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "tanningStages",
                                i18nKey: "menu.leathers.tanning-stages",
                            }
                        })
                    }}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<ILeatherForm>
                    name={"weight_id"}
                    label={t("leathers.leather.weight")}
                    options={weights.map((x) => ({
                        label: x.name,
                        value: x.id
                    }))}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "weights",
                                i18nKey: "menu.leathers.weights"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<ILeatherForm>
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
            </Box>
        </>
    )
}

export default LeathersForm;
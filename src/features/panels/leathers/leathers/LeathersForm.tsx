import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
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
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";

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
    contact_id: number;
    weight_id: number;
    thickness_id: number;
    flay_id: number;
    status_id: number;
    provenance_id: number;
    species_id: number;
    type_id: number;
    sqft_leather_expected?: number | null;
    kg_leather_expected?: number | null;
    container_piece?: number | null;
    crust_revenue_expected?: number | null;
};

const LeathersForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ILeathersStoreState>();
    const selectedLeatherId = useStore(state => state.uiState.selectedLeatherId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = leatherApi;
    const {data: leather} = useGetDetail(selectedLeatherId);
    const {mutateAsync: createLeather, isPending: isPosting} = usePost();
    const {mutateAsync: updateLeather, isPending: isPutting} = usePut();
    const {mutateAsync: deleteLeather, isPending: isDeleting} = useDelete();

    const {data: contacts = []} = contactsApi.useGetList();

    const {data: origins = []} = originApi.useGetList();
    const {data: species = []} = speciesApi.useGetList();
    const {data: types = []} = leatherTypeApi.useGetList();
    const {data: tanningStages = []} = tanningStageApi.useGetList();
    const {data: weights = []} = thicknessApi.useGetList();
    const {data: thicknesses = []} = thicknessApi.useGetList();
    const {data: flays = []} = flayApi.useGetList();

    return (
        <GenericForm<ILeatherForm, ILeather, ILeathersStoreState>
            selectedId={selectedLeatherId}
            entity={leather}
            emptyValues={{
                contact_id: 0,
                weight_id: 0,
                species_id: 0,
                // supplier_id: 0,
                thickness_id: 0,
                flay_id: 0,
                type_id: 0,
                provenance_id: 0,
                status_id: 0,
                sqft_leather_expected: null,
                kg_leather_expected: null,
                statistic_update: false,
                container_piece: null,
                crust_revenue_expected: null,
            }}
            mapEntityToForm={(x) => ({
                contact_id: x.contact.id,
                weight_id: x.weight.id,
                species_id: x.species.id,
                thickness_id: x.thickness.id,
                flay_id: x.flay.id,
                type_id: x.type.id,
                provenance_id: x.provenance.id,
                status_id: x.status.id,
                sqft_leather_expected: x.sqft_leather_expected,
                kg_leather_expected: x.kg_leather_expected,
                statistic_update: x.statistic_update,
                container_piece: x.container_piece,
                crust_revenue_expected: x.crust_revenue_expected,
            })}
            create={(payload) => createLeather(payload as any)}
            update={(id, payload) => updateLeather({id, payload: payload as any})}
            remove={(id) => deleteLeather(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedLeatherId: null})}
            validateBeforeSave={(v) => !!v.weight_id && !!v.species_id && !!v.thickness_id && !!v.flay_id && !!v.type_id && !!v.provenance_id && !!v.status_id && !!v.sqft_leather_expected && !!v.kg_leather_expected}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <SelectFieldControlled<ILeatherForm>
                            name={"contact_id"}
                            label={t("leathers.leather.contact")}
                            options={contacts.map((x) => ({
                                label: x.name,
                                value: x.id
                            }))}
                        />
                        <SelectFieldControlled<ILeatherForm>
                            name={"provenance_id"}
                            label={t("leathers.leather.origin")}
                            options={origins.map((x) => ({
                                label: `${x.nation.name} - ${x.area.name}`,
                                value: x.id
                            }))}
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
                        />
                        <SelectFieldControlled<ILeatherForm>
                            name={"type_id"}
                            label={t("leathers.leather.type")}
                            options={types.map((x) => ({
                                label: x.name,
                                value: x.id
                            }))}
                        />
                        <SelectFieldControlled<ILeatherForm>
                            name={"status_id"}
                            label={t("leathers.leather.status")}
                            options={tanningStages.map((x) => ({
                                label: x.name,
                                value: x.id
                            }))}
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
                        />
                        <SelectFieldControlled<ILeatherForm>
                            name={"thickness_id"}
                            label={t("leathers.leather.thickness")}
                            options={thicknesses.map((x) => ({
                                label: x.name,
                                value: x.id
                            }))}
                        />
                        <SelectFieldControlled<ILeatherForm>
                            name={"flay_id"}
                            label={t("leathers.leather.flay")}
                            options={flays.map((x) => ({
                                label: x.name,
                                value: x.id
                            }))}
                        />
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <NumberFieldControlled<ILeatherForm>
                            name={"sqft_leather_expected"}
                            label={t("leathers.leather.sqft-leather-expected")}
                            maxWidth={"200px"}
                        />
                        <NumberFieldControlled<ILeatherForm>
                            name={"kg_leather_expected"}
                            label={t("leathers.leather.kg-leather-expected")}
                            maxWidth={"200px"}
                        />
                        <NumberFieldControlled<ILeatherForm>
                            name={"container_piece"}
                            label={t("leathers.leather.container-piece")}
                            precision={0}
                        />
                    </Box>
                </>
            )}
        />
    )
}

export default LeathersForm;
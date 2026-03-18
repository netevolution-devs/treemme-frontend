import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICapStoreState} from "@features/panels/contacts/cap/CapPanel.tsx";
import {capApi} from "@features/panels/contacts/cap/api/capApi.ts";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import useSubscribePanel from "@ui/panel/useSubscribePanel.ts";

export type ICapForm = {
    cap: string;
    name: string;
    province_id: number;
};

const CapForm = () => {
    const {useStore} = usePanel<unknown, ICapStoreState>();
    const selectedCapId = useStore(state => state.uiState.selectedCapId);
    const setUIState = useStore(state => state.setUIState);

    const { useGetDetail, usePost, usePut, useDelete } = capApi;
    const {data: cap} = useGetDetail(selectedCapId);
    const {mutateAsync: createCap, isPending: isPosting} = usePost();
    const {mutateAsync: updateCap, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCap, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ICapForm, ICap, ICapStoreState>
            selectedId={selectedCapId}
            entity={cap}
            emptyValues={{ cap: '', name: '', province_id: 0 }}
            mapEntityToForm={(c) => ({
                cap: c.cap,
                name: c.name,
                province_id: c.province.id
            })}
            create={(payload) => createCap(payload)}
            update={(id, payload) => updateCap({ id, payload })}
            remove={(id) => deleteCap(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedCapId: null })}
            validateBeforeSave={(v) => !!v.cap && !!v.name && !!v.province_id}
            renderFields={() => (
                <CapFormFields />
            )}
        />
    );
};

const CapFormFields = () => {
    const {t} = useTranslation(["form"]);
    const {data: provinces = []} = provinceApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();
    useSubscribePanel<ICapForm>({
        formKey: "province_id",
        dependencyKey: "province"
    })

    return (
        <>
            <SelectFieldControlled<ICapForm>
                name="province_id"
                label={t("province.name")}
                options={provinces?.map(p => ({
                    value: p.id,
                    label: `${p.acronym} - ${p.name}`
                })) || []}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "province",
                            i18nKey: "menu.contacts.provinces"
                        }
                    })
                }}
            />
            <TextFieldControlled<ICapForm>
                name="cap"
                label={t("cap.code")}
                required
            />
            <TextFieldControlled<ICapForm>
                name="name"
                label={t("cap.name")}
                required
            />
        </>
    )
}

export default CapForm;
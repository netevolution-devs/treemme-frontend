import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    IArticleColorsStoreParams,
    IArticleColorsStoreState
} from "@features/panels/products/article-colors/ArticleColorsPanel.tsx";
import {colorApi} from "@features/panels/products/article-colors/api/colorApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {useMemo} from "react";
import {Box} from "@mui/material";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";

export type IColorForm = {
    color: string;
    shade: string;
    var_color: string;
    color_note: string;
    client_color: string;
    client_id: number | null;
}

const ArticleColorsForm = ({initialName, onSuccess, extra}: ICustomPanelFormProps<IArticleColorsStoreParams>) => {
    const {useStore} = usePanel<unknown, IArticleColorsStoreState>();
    const selectedColorId = useStore(state => state.uiState.selectedColorId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedColorId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = colorApi;
    const {data: colorEntity} = useGetDetail(selectedColorId);
    const {mutateAsync: createColor, isPending: isPosting} = usePost();
    const {mutateAsync: updateColor, isPending: isPutting} = usePut();
    const {mutateAsync: deleteColor, isPending: isDeleting} = useDelete();

    const {data: contacts = []} = contactsApi.useGetList();

    const clientOptions = useMemo(() =>
            contacts.filter(c => c.client).map(c => ({value: c.id, label: c.name})),
        [contacts]);

    return (
        <GenericForm<IColorForm, IColor, IArticleColorsStoreState>
            onSuccess={handlePanelSuccess}
            selectedId={selectedColorId}
            entity={colorEntity}
            emptyValues={{
                color: initialName ?? '',
                shade: '',
                var_color: '',
                color_note: '',
                client_color: '',
                client_id: extra?.client_id ?? null,
            }}
            mapEntityToForm={(c) => ({
                color: c.color,
                shade: c.shade ?? '',
                var_color: c.var_color ?? '',
                color_note: c.color_note ?? '',
                client_color: c.client_color,
                client_id: c.client?.id ?? null,
            })}
            create={(payload) => createColor(payload)}
            update={(id, payload) => updateColor({id, payload})}
            remove={(id) => deleteColor(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedColorId: null})}
            validateBeforeSave={(v) => !!v.color && !!v.client_id && !!v.client_color}
            renderFields={() => <ArticleColorsFormFields
                clientOptions={clientOptions}
            />}
        />
    );
};

interface ArticleColorsFormFieldsProps {
    clientOptions: { value: number; label: string }[];
}

const ArticleColorsFormFields = ({
                                     clientOptions,
                                 }: ArticleColorsFormFieldsProps) => {
    const {t} = useTranslation(["form"]);

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IColorForm>
                    name="color"
                    label={t("products.article_colors.color")}
                    required
                />
                <TextFieldControlled<IColorForm>
                    name="shade"
                    label={t("products.article_colors.shade")}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IColorForm>
                    name="var_color"
                    label={t("products.article_colors.var_color")}
                />
                <TextFieldControlled<IColorForm>
                    name="client_color"
                    label={t("products.article_colors.client_color")}
                    required
                />
            </Box>
            <SelectFieldControlled<IColorForm>
                name="client_id"
                label={t("products.article_colors.client")}
                options={clientOptions}
                required
            />
            <TextFieldControlled<IColorForm>
                name="color_note"
                label={t("products.article_colors.color_note")}
                TextFieldProps={{
                    multiline: true,
                    rows: 2
                }}
            />
        </>
    );
}

export default ArticleColorsForm;
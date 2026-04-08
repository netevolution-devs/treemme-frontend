import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IArticleColorsStoreParams,
    IArticleColorsStoreState
} from "@features/panels/products/article-colors/ArticleColorsPanel";
import {internalColorApi} from "@features/panels/products/article-internal-colors/api/internalColorApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IColor} from "@features/panels/products/article-colors/api/IColor";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo} from "react";
import {Box} from "@mui/material";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import {colorApi} from "@features/panels/products/article-colors/api/colorApi";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export type IColorForm = {
    color: string;
    color_note: string;
    client_id: number | null;
    internal_color_id: number | null;
    // shade: string;
    // var_color: string;
    // client_color: string;
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
    const {data: internalColors = []} = internalColorApi.useGetList();

    const clientOptions = useMemo(() =>
            contacts.filter(c => c.client).map(c => ({value: c.id, label: c.name})),
        [contacts]);

    const internalColorOptions = useMemo(() =>
            internalColors.map(ic => ({value: ic.id, label: ic.name})),
        [internalColors]);

    return (
        <GenericForm<IColorForm, IColor, IArticleColorsStoreState>
            onSuccess={handlePanelSuccess}
            resource="articoli - colori"
            selectedId={selectedColorId}
            entity={colorEntity}
            emptyValues={{
                color: initialName ?? '',
                color_note: '',
                client_id: extra?.client_id ?? null,
                internal_color_id: null,
                // shade: '',
                // client_color: '',
                // var_color: '',
            }}
            mapEntityToForm={(c) => ({
                color: c.color,
                color_note: c.color_note ?? '',
                client_id: c.client?.id ?? null,
                internal_color_id: c.internal_color?.id ?? null,
                // shade: c.shade ?? '',
                // var_color: c.var_color ?? '',
                // client_color: c.client_color,
            })}
            create={(payload) => createColor(payload)}
            update={(id, payload) => updateColor({id, payload})}
            remove={(id) => deleteColor(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedColorId: null})}
            validateBeforeSave={(v) => !!v.color && !!v.client_id}
            renderFields={() => <ArticleColorsFormFields
                clientOptions={clientOptions}
                internalColorOptions={internalColorOptions}
            />}
        />
    );
};

interface ArticleColorsFormFieldsProps {
    clientOptions: { value: number; label: string }[];
    internalColorOptions: { value: number; label: string }[];
}

const ArticleColorsFormFields = ({
                                     clientOptions,
                                     internalColorOptions,
                                 }: ArticleColorsFormFieldsProps) => {
    const {t} = useTranslation(["form"]);

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IColorForm>({
        formKey: "internal_color_id",
        dependencyKey: "articleInternalColors"
    })

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IColorForm>
                    name="color"
                    label={t("products.article_colors.color")}
                    required
                />
                <SelectFieldControlled<IColorForm>
                    name="internal_color_id"
                    label={t("products.article_internal_colors.name")}
                    options={internalColorOptions}
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            initialValue: input,
                            menu: {
                                component: "articleInternalColors",
                                i18nKey: "menu.products.article-internal-colors"
                            }
                        })
                    }}
                />
                {/*<TextFieldControlled<IColorForm>*/}
                {/*    name="shade"*/}
                {/*    label={t("products.article_colors.shade")}*/}
                {/*/>*/}
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                {/*<TextFieldControlled<IColorForm>*/}
                {/*    name="var_color"*/}
                {/*    label={t("products.article_colors.var_color")}*/}
                {/*/>*/}
                {/*<TextFieldControlled<IColorForm>*/}
                {/*    name="client_color"*/}
                {/*    label={t("products.article_colors.client_color")}*/}
                {/*    required*/}
                {/*/>*/}
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
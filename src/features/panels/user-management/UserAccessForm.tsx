import {useTranslation} from "react-i18next";
import {FormProvider, useForm} from "react-hook-form";
import {Box, Button, CircularProgress, Stack} from "@mui/material";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {groupManagementApi} from "@features/panels/user-management/api/groupManagementApi.ts";
import {roleManagementApi} from "@features/panels/user-management/api/roleManagementApi.ts";
import {workAreaManagementApi} from "@features/panels/user-management/api/workAreaManagementApi.ts";
import {useAssignGroupAccess} from "@features/panels/user-management/api/userManagementApi.ts";

interface IAccessForm {
    group_id: number;
    role_id: number;
    work_area_id: number;
}

const emptyValues: IAccessForm = {group_id: 0, role_id: 0, work_area_id: 0};

const UserAccessForm = () => {
    const {t} = useTranslation(["form"]);

    const methods = useForm<IAccessForm>({defaultValues: emptyValues});
    const {mutateAsync: assignAccess, isPending} = useAssignGroupAccess();

    const {data: groups = []} = groupManagementApi.useGetList();
    const {data: roles = []} = roleManagementApi.useGetList();
    const {data: workAreas = []} = workAreaManagementApi.useGetList();

    const groupOptions = groups.map(g => ({value: g.id, label: g.name}));
    const roleOptions = roles.map(r => ({value: r.id, label: r.name}));
    const workAreaOptions = workAreas.map(w => ({value: w.id, label: w.name}));

    const onSubmit = async (data: IAccessForm) => {
        await assignAccess({group_id: data.group_id, role_id: data.role_id, work_area_id: data.work_area_id});
        methods.reset(emptyValues);
    };

    return (
        <FormProvider {...methods}>
            <Stack
                direction="row"
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void methods.handleSubmit(onSubmit)(e);
                }}
                autoComplete="off"
                spacing={2}
                sx={{mt: 2}}
            >
                <SelectFieldControlled<IAccessForm>
                    name="group_id"
                    label={t("form:access_management.group_id")}
                    options={groupOptions}
                    required
                />
                <SelectFieldControlled<IAccessForm>
                    name="role_id"
                    label={t("form:access_management.role_id")}
                    options={roleOptions}
                    required
                />
                <SelectFieldControlled<IAccessForm>
                    name="work_area_id"
                    label={t("form:access_management.work_area_id")}
                    options={workAreaOptions}
                    required
                />
                <Box sx={{display: "flex", justifyContent: "flex-end", mt: 1}}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={14} /> : undefined}
                    >
                        {t("form:access_management.submit")}
                    </Button>
                </Box>
            </Stack>
        </FormProvider>
    );
};

export default UserAccessForm;

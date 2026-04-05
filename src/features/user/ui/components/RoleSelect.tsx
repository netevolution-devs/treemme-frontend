import {CircularProgress, Autocomplete, TextField, Chip, Box} from "@mui/material";
import useGetRoles from "../../api/useGetRoles";
import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import type {ControlledFieldProps} from "@shared/ui/form/controlled/ControlledFieldProps";
import {useTranslation} from "react-i18next";

const RoleSelect = <TFieldValues extends FieldValues>({
                                                          name,
                                                          required = true
                                                      }: ControlledFieldProps<TFieldValues>) => {
    const {t} = useTranslation(["common", "form"]);

    const {data: roles, isLoading} = useGetRoles();

    const {control} = useFormContext();

    if (isLoading) {
        return <CircularProgress/>;
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required && t("form:user.create.rules.roles"),
                validate: required
                    ? (value) => (value && value.length > 0) || t("form:user.create.rules.roles")
                    : () => false,
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
                <Autocomplete
                    multiple
                    options={roles || []}
                    getOptionLabel={(option) => option.name}
                    value={value || []}
                    onChange={(_, newValue) => {
                        onChange(newValue);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => {
                        const {InputProps, id, disabled} = params;

                        return (
                            <TextField
                                slotProps={{
                                    input: {
                                        ...InputProps,
                                    }
                                }}
                                id={id}
                                disabled={disabled}
                                fullWidth
                                variant="outlined"
                                size="small"
                                label={t("form:user.create.fields.roles-label")}
                                placeholder={t("form:user.create.fields.roles-placeholder")}
                                error={!!error}
                                helperText={error ? error?.message : " "}
                            />
                        );
                    }}
                    renderValue={(value, getTagProps) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {value.map((option, index) => (
                                <Chip
                                    label={option.name}
                                    {...getTagProps({index})}
                                    key={option.id}
                                    color="primary"
                                    size="small"
                                />
                            ))}
                        </Box>
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip
                                label={option.name}
                                size="small"
                                variant="outlined"
                                sx={{cursor: 'pointer'}}
                            />
                            {option.description && (
                                <Box component="span" sx={{ml: 1, fontSize: '0.875rem', color: 'text.secondary'}}>
                                    {option.description}
                                </Box>
                            )}
                        </li>
                    )}
                />
            )}
        />
    );
};

export default RoleSelect;
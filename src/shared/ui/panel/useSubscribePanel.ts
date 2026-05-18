import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type FieldValues, type Path, type PathValue, useFormContext } from "react-hook-form";
import type { TPanelKind } from "@features/panels/PanelRegistry";

interface ISubscribeProps<T extends FieldValues> {
    formKey: Path<T>;
    dependencyKey: TPanelKind;
    isMulti?: boolean;
}

const useSubscribePanel = <T extends FieldValues>({ formKey, dependencyKey, isMulti = false }: ISubscribeProps<T>) => {
    const queryClient = useQueryClient();
    const { setValue, getValues } = useFormContext<T>();

    useEffect(() => {
        const queryKey = ['LAST_CREATED', dependencyKey];

        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event.type === 'updated'
                && event.query.queryKey[0] === 'LAST_CREATED'
                && event.query.queryKey[1] === dependencyKey
            ) {
                const lastId = queryClient.getQueryData<number>(queryKey);

                if (lastId) {
                    let newValueToSet: unknown = lastId;

                    if (isMulti) {
                        const currentValue = getValues(formKey);
                        if (typeof currentValue === 'string') {
                            const currentIds = currentValue ? currentValue.split(',') : [];
                            const newIdStr = String(lastId);

                            if (!currentIds.includes(newIdStr)) {
                                newValueToSet = [...currentIds, newIdStr].join(',');
                            } else {
                                newValueToSet = currentValue;
                            }
                        }
                    }

                    setValue(formKey, newValueToSet as PathValue<T, Path<T>>, {
                        shouldValidate: true,
                        shouldDirty: true
                    });

                    queryClient.setQueryData(queryKey, null);
                }
            }
        });

        return () => unsubscribe();
    }, [queryClient, setValue, getValues, formKey, dependencyKey, isMulti]);
};

export default useSubscribePanel;
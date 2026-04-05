import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type FieldValues, type Path, type PathValue, useFormContext } from "react-hook-form";
import type {TPanelKind} from "@features/panels/PanelRegistry";

interface ISubscribeProps<T extends FieldValues> {
    formKey: Path<T>;
    dependencyKey: TPanelKind;
}

const useSubscribePanel = <T extends FieldValues>({ formKey, dependencyKey }: ISubscribeProps<T>) => {
    const queryClient = useQueryClient();
    const { setValue } = useFormContext<T>();

    useEffect(() => {
        const queryKey = ['LAST_CREATED', dependencyKey];

        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event.type === 'updated'
                && event.query.queryKey[0] === 'LAST_CREATED'
                && event.query.queryKey[1] === dependencyKey
            ) {
                const lastId = queryClient.getQueryData<number>(queryKey);

                if (lastId) {
                    setValue(formKey, lastId as PathValue<T, Path<T>>, {
                        shouldValidate: true,
                        shouldDirty: true
                    });

                    queryClient.setQueryData(queryKey, null);
                }
            }
        });

        return () => unsubscribe();
    }, [queryClient, setValue, formKey, dependencyKey]);
};

export default useSubscribePanel;
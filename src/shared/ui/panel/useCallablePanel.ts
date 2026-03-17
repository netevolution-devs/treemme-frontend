import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {useCallback} from "react";
import type {IMenuEntry} from "@ui/layout/menu/MenuEntries.ts";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";

interface CallablePanelProps {
    initialValue: string;
    menu: Pick<IMenuEntry,
        'component' |
        'i18nKey'
    >
}

const useCallablePanel = () => {
    const {t} = useTranslation(["form"]);
    const addPanel = useDockviewStore(state => state.addPanel);
    const queryClient = useQueryClient();

    const add = useCallback(({initialValue, menu}: CallablePanelProps) => {
        addPanel({
            id: `${menu.component}:${crypto.randomUUID()}`,
            component: menu.component || "not-implemented",
            title: t(menu.i18nKey),
            floating: {
                width: 600,
                height: 800,
            },
            params: {
                initialName: initialValue,
                onSuccess: (id: number) => {
                    queryClient.setQueryData(['LAST_CREATED', menu.component], id);
                }
            }
        });
    }, [addPanel, t, queryClient]);

    return {add};
};

export default useCallablePanel;
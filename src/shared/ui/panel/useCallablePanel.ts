import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import {useCallback} from "react";
import type {IMenuEntry} from "@ui/layout/menu/MenuEntries";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";

interface CallablePanelProps<TExtra = unknown> {
    initialValue: string;
    menu: Pick<IMenuEntry,
        'component' |
        'i18nKey'
    >
    extra?: TExtra;
    customId?: string;
}

const useCallablePanel = () => {
    const {t} = useTranslation(["menu"]);
    const addPanel = useDockviewStore(state => state.addPanel);
    const queryClient = useQueryClient();

    const add = useCallback(({initialValue, menu, extra, customId}: CallablePanelProps) => {
        const dockviewApi = useDockviewStore.getState().api;

        let floatingPanelsCount = 0;
        if (dockviewApi) {
            floatingPanelsCount = Object.values(dockviewApi.panels).filter(p => {
                return p.group.model.location.type === 'floating';
            }).length;
        }
        const offset = (floatingPanelsCount % 6) * 50;

        addPanel({
            id: customId || `${menu.component}:${crypto.randomUUID()}`,
            component: menu.component || "not-implemented",
            title: t(menu.i18nKey),
            floating: {
                width: 900,
                height: 800,
                x: 100 + offset,
                y: 10 + offset,
            },
            params: {
                initialName: initialValue,
                onSuccess: (id: number) => {
                    queryClient.setQueryData(['LAST_CREATED', menu.component], id);
                },
                extra
            }
        }, {overrideLogic: true});
    }, [addPanel, t, queryClient]);

    return {add};
};

export default useCallablePanel;
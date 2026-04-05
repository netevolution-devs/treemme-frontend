import {usePanel} from "@ui/panel/PanelContext";
import type {IButtonState} from "@features/panels/shared/FormButtons";

export type TPanelFormState = 'view' | 'edit' | 'new' | 'cancel' | 'init' | 'selected';

export interface IPanelUIState {
    isFormDisabled: boolean;
    buttonsState: IButtonState;
}

export const usePanelFormButtons = <F, U extends IPanelUIState>() => {
    const {useStore} = usePanel<F, U>();
    const setUIState = useStore(state => state.setUIState);

    const setFormState = (state: TPanelFormState) => {
        switch (state) {
            case 'init':
                setUIState({
                    isFormDisabled: true,
                    buttonsState: {
                        new: true,
                        edit: false,
                        delete: false,
                        cancel: false,
                        save: false
                    }
                } as Partial<U>);
                break;
            case 'new':
                setUIState({
                    isFormDisabled: false,
                    buttonsState: {
                        new: false,
                        edit: false,
                        delete: false,
                        cancel: true,
                        save: true
                    }
                } as Partial<U>);
                break;
            case 'edit':
                setUIState({
                    isFormDisabled: false,
                    buttonsState: {
                        new: false,
                        edit: false,
                        delete: false,
                        cancel: true,
                        save: true
                    }
                } as Partial<U>);
                break;
            case 'selected':
                setUIState({
                    isFormDisabled: true,
                    buttonsState: {
                        new: false,
                        edit: true,
                        delete: true,
                        cancel: true,
                        save: false
                    }
                } as Partial<U>);
                break;
            case 'view':
            case 'cancel':
                setUIState({
                    isFormDisabled: true,
                    buttonsState: {
                        new: true,
                        edit: false,
                        delete: false,
                        cancel: false,
                        save: false
                    }
                } as Partial<U>);
                break;
        }
    };

    return {setFormState};
};

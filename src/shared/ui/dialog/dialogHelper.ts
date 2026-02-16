import type {IDialogActions} from "./IDialogActions";

function withRef(ref: React.Ref<IDialogActions> | null, fn: (dialog: IDialogActions) => void) {
    if (!ref) return;
    if ("current" in ref && ref.current) {
        fn(ref.current);
    } else if (typeof ref === "function") {
        fn({
            getStatus: false,
            open: () => {
            },
            close: () => {
            },
        });
    }
}

export function openDialog(ref: React.Ref<IDialogActions> | null) {
    withRef(ref, dialog => dialog.open());
}

export function closeDialog(ref: React.Ref<IDialogActions> | null) {
    withRef(ref, dialog => dialog.close());
}
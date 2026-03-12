import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";

type Props = unknown;

const BatchCompositionFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    return (
        <BaseDialog ref={ref}>
            <>works</>
        </BaseDialog>
    );
});

export default BatchCompositionFormDialog;
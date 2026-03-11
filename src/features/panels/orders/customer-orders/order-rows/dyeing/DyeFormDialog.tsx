import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";

type Props = unknown;

const DyeFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    return (
        <BaseDialog ref={ref}>
            <div>
                <h1>Dye Form</h1>
            </div>
        </BaseDialog>
    )
});

export default DyeFormDialog;
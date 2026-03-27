import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";

type Props = unknown;

const DDTTransferFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <>works transfer</>
        </BaseDialog>
    )
})

export default DDTTransferFormDialog;
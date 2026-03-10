import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";

type Props = unknown;

const OrderRowsFormDialog =  forwardRef<IDialogActions, Props>((_props, ref)  => {
    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <>content dialog</>
        </BaseDialog>
    );
});

export default OrderRowsFormDialog;
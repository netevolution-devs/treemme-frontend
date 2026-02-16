import type {FieldValues, Path, RegisterOptions} from "react-hook-form";
import type {TextFieldProps as MUITextFieldProps} from "@mui/material";

export interface ControlledFieldProps<TFieldValues extends FieldValues>{
    name: Path<TFieldValues>,
    label?: string,
    required?:boolean,
    TextFieldProps?: MUITextFieldProps,
    showHelperRow?: boolean,
    showRequired?: boolean,
    rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined,
    autoComplete?: string;
    maxLength?: number;
}

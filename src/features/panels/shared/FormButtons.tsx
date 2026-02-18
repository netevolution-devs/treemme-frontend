import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";

interface CustomButtonProps {
    label: string;
    onClick: () => void;
    color: "primary" | "success" | "error" | "warning";
    isSubmit?: boolean;
    isEnable?: boolean;
}

const CustomButton = ({label, onClick, color, isSubmit = false, isEnable = true}: CustomButtonProps) => {
    const {t} = useTranslation(["common"]);

    return (
        <Button
            variant="outlined"
            onClick={onClick}
            color={color}
            size="small"
            sx={{minWidth: 130}}
            type={isSubmit ? "submit" : "button"}
            disabled={!isEnable}
        >
            {t(label)}
        </Button>
    )
}

interface FormButtonsProps {
    onNew: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSave?: () => void;

    buttonState?: {
        new: boolean,
        edit: boolean,
        delete: boolean,
        save: boolean
    }
}

const FormButtons = ({onNew, onEdit, onDelete, onSave, buttonState}: FormButtonsProps) => {
    return (
        <Box sx={{display: "flex", gap: 1}}>
            <CustomButton
                onClick={onNew}
                label={"button.new"}
                color={"primary"}
                isEnable={buttonState?.new ?? BaseButtonState.new}
            />
            <CustomButton
                onClick={onEdit}
                label={"button.edit"}
                color={"warning"}
                isEnable={buttonState?.edit ?? BaseButtonState.edit}
            />
            <CustomButton
                onClick={onDelete}
                label={"button.delete"}
                color={"error"}
                isEnable={buttonState?.delete ?? BaseButtonState.delete}
            />
            <CustomButton
                onClick={() => onSave?.()}
                label={"button.save"}
                color={"success"}
                isSubmit
                isEnable={buttonState?.save ?? BaseButtonState.save}
            />
        </Box>
    )
}

export const BaseButtonState = {
    new: true,
    edit: false,
    delete: false,
    save: false
}

export default FormButtons;
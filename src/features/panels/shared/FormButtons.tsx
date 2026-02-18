import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";

interface CustomButtonProps {
    label: string;
    onClick: () => void;
    color: "primary" | "success" | "error" | "warning";
}

const CustomButton = ({label, onClick, color}: CustomButtonProps) => {
    const {t} = useTranslation(["common"]);

    return (
        <Button
            variant="outlined"
            onClick={onClick}
            color={color}
            size="small"
            sx={{minWidth: 130}}
        >
            {t(label)}
        </Button>
    )
}

interface FormButtonsProps {
    onNew: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSave: () => void;
}

const FormButtons = ({onNew, onEdit, onDelete, onSave}: FormButtonsProps) => {
    return (
        <Box sx={{display: "flex", gap: 1}}>
            <CustomButton
                onClick={onNew}
                label={"button.new"}
                color={"primary"}
            />
            <CustomButton
                onClick={onEdit}
                label={"button.edit"}
                color={"warning"}
            />
            <CustomButton
                onClick={onDelete}
                label={"button.delete"}
                color={"error"}
            />
            <CustomButton
                onClick={onSave}
                label={"button.save"}
                color={"success"}
            />
        </Box>
    )
}

export default FormButtons;
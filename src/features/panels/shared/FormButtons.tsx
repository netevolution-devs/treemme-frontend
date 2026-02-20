import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface CustomButtonProps {
    label: string;
    onClick: () => void;
    color: "primary" | "success" | "error" | "warning" | "inherit";
    isSubmit?: boolean;
    isEnable?: boolean;
    icon: React.ReactNode;
}

interface FormButtonsProps {
    onNew: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onCancel: () => void;
    onSave?: () => void;
    buttonState: IButtonState;
}

export interface IButtonState {
    new: boolean;
    edit: boolean;
    delete: boolean;
    save: boolean;
    cancel: boolean;
}

export const BaseButtonState: IButtonState = {
    new: true,
    edit: false,
    delete: false,
    save: false,
    cancel: false
};

const CustomButton = ({ label, onClick, color, isSubmit = false, isEnable = true, icon }: CustomButtonProps) => {
    const { t } = useTranslation(["common"]);

    return (
        <Button
            variant="outlined"
            onClick={onClick}
            color={color}
            size="small"
            startIcon={icon}
            sx={{
                minWidth: 100,
                fontWeight: 'bold',
                textTransform: 'none'
            }}
            type={isSubmit ? "submit" : "button"}
            disabled={!isEnable}
        >
            {t(label)}
        </Button>
    );
};


const FormButtons = ({ onNew, onEdit, onDelete, onCancel, onSave, buttonState }: FormButtonsProps) => {
    return (
        <Box sx={{
            display: "flex",
            gap: 1,
            backgroundColor: "background.paper",
            borderRadius: 1,
            top: 0,
            zIndex: 10,
        }}>
            <CustomButton
                onClick={onNew}
                label={"button.new"}
                color={"primary"}
                icon={<AddIcon />}
                isEnable={buttonState.new}
            />
            <CustomButton
                onClick={onEdit}
                label={"button.edit"}
                color={"warning"}
                icon={<EditIcon />}
                isEnable={buttonState.edit}
            />
            <CustomButton
                onClick={onDelete}
                label={"button.delete"}
                color={"error"}
                icon={<DeleteIcon />}
                isEnable={buttonState.delete}
            />

            <>
                <CustomButton
                    onClick={onCancel}
                    label={"button.cancel"}
                    color={"inherit"}
                    icon={<CloseIcon />}
                    isEnable={buttonState.cancel}
                />
                <CustomButton
                    onClick={() => onSave?.()}
                    label={"button.save"}
                    color={"success"}
                    icon={<SaveIcon />}
                    isSubmit
                    isEnable={buttonState.save}
                />
            </>
        </Box>
    );
};

export default FormButtons;
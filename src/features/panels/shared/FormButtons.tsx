import {Box} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from "@features/panels/shared/CustomButton";
import SaveAsIcon from '@mui/icons-material/SaveAs';

export interface IButtonState {
    new: boolean;
    edit: boolean;
    delete: boolean;
    save: boolean;
    cancel: boolean;
    update: boolean;
}

export const BaseButtonState: IButtonState = {
    new: true,
    edit: false,
    delete: false,
    save: false,
    cancel: false,
    update: false
};

interface FormButtonsProps {
    onNew: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onCancel: () => void;
    onSave?: () => void;
    buttonState: IButtonState;
    hideNew?: boolean;
    hideEdit?: boolean;
    hideDelete?: boolean;
    hideCancel?: boolean;
    hideSave?: boolean;
    overrideButtonState?: boolean;
    isLoading?: boolean;
    onUpdate?: () => void;
    hideUpdate?: boolean;
}

const FormButtons = ({
                         onNew,
                         onEdit,
                         onDelete,
                         onCancel,
                         onSave,
                         buttonState,
                         hideNew = false,
                         hideEdit = false,
                         hideDelete = false,
                         hideCancel = false,
                         hideSave = false,
                         overrideButtonState = false,
                         isLoading = false,
                         onUpdate,
                         hideUpdate = false,
                     }: FormButtonsProps) => {
    return (
        <Box sx={{
            display: "flex",
            gap: 1,
            borderRadius: 1,
            top: 0,
            zIndex: 10,
        }}>
            {!hideNew && (
                <CustomButton
                    onClick={onNew}
                    label={"button.new"}
                    color={"primary"}
                    icon={<AddIcon/>}
                    isEnable={buttonState.new || overrideButtonState}
                />
            )}
            {!hideEdit && (
                <CustomButton
                    onClick={onEdit}
                    label={"button.edit"}
                    color={"warning"}
                    icon={<EditIcon/>}
                    isEnable={buttonState.edit || overrideButtonState}
                />
            )}
            {!hideDelete && (
                <CustomButton
                    onClick={onDelete}
                    label={"button.delete"}
                    color={"error"}
                    icon={<DeleteIcon/>}
                    isEnable={buttonState.delete || overrideButtonState}
                />
            )}
            {!hideCancel && (
                <CustomButton
                    onClick={onCancel}
                    label={"button.cancel"}
                    color={"inherit"}
                    icon={<CloseIcon/>}
                    isEnable={buttonState.cancel || overrideButtonState}
                />
            )}
            {!hideUpdate && (
                <CustomButton
                    onClick={() => onUpdate?.()}
                    label={"button.update"}
                    color={"primary"}
                    icon={<SaveAsIcon/>}
                    isEnable={buttonState.update || overrideButtonState}
                    isLoading={isLoading}
                />
            )}
            {!hideSave && (
                <CustomButton
                    onClick={() => onSave?.()}
                    label={"button.save"}
                    color={"success"}
                    icon={<SaveIcon/>}
                    isSubmit
                    isEnable={buttonState.save || overrideButtonState}
                    isLoading={isLoading}
                />
            )}
        </Box>
    );
};

export default FormButtons;
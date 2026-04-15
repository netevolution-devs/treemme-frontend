import {Button, CircularProgress, type SxProps} from "@mui/material";
import {useTranslation} from "react-i18next";
import type {ReactNode} from "react";
import AddIcon from "@mui/icons-material/Add";

interface CustomButtonProps {
    label: string;
    onClick?: () => void;
    color: "primary" | "success" | "error" | "warning" | "inherit";
    isSubmit?: boolean;
    isEnable?: boolean;
    isLoading?: boolean;
    icon: ReactNode;
    variant?: "text" | "outlined" | "contained";
    minWidth?: number;
    sx?: SxProps;
}

const CustomButton = ({label, onClick, color, isSubmit = false, isEnable = true, isLoading = false, icon, variant = "outlined", minWidth = 100, sx}: CustomButtonProps) => {
    const {t} = useTranslation(["common"]);

    return (
        <Button
            variant={variant}
            onClick={onClick}
            color={color}
            size="small"
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : (label && icon)}
            sx={{
                height: "100%",
                minWidth: minWidth,
                fontWeight: 'bold',
                textTransform: 'none',
                ...sx
            }}
            type={isSubmit ? "submit" : "button"}
            disabled={!isEnable || isLoading}
        >
            {label ? t(label) : icon}
        </Button>
    );
};

interface CustomButtonPropsEvent {
    onClick: () => void;
    isEnable?: boolean;
    disableLabel?: boolean;
    sx?: SxProps;
}

export const NewButton = ({onClick, isEnable = true, disableLabel = false, sx}: CustomButtonPropsEvent) => {
    return (
        <CustomButton
            onClick={onClick}
            label={!disableLabel ? "button.new" : ""}
            color={"primary"}
            minWidth={disableLabel ? 0 : 100}
            icon={<AddIcon/>}
            isEnable={isEnable}
            sx={sx as SxProps}
        />
    )
}

export default CustomButton;
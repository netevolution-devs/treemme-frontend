import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import type {ReactNode} from "react";
import AddIcon from "@mui/icons-material/Add";

interface CustomButtonProps {
    label: string;
    onClick?: () => void;
    color: "primary" | "success" | "error" | "warning" | "inherit";
    isSubmit?: boolean;
    isEnable?: boolean;
    icon: ReactNode;
    variant?: "text" | "outlined" | "contained";
}

const CustomButton = ({label, onClick, color, isSubmit = false, isEnable = true, icon, variant = "outlined"}: CustomButtonProps) => {
    const {t} = useTranslation(["common"]);

    return (
        <Button
            variant={variant}
            onClick={onClick}
            color={color}
            size="small"
            startIcon={icon}
            sx={{
                height: "100%",
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

interface CustomButtonPropsEvent {
    onClick: () => void;
    isEnable?: boolean;
}

export const NewButton = ({onClick, isEnable = true}: CustomButtonPropsEvent) => {
    return (
        <CustomButton
            onClick={onClick}
            label={"button.new"}
            color={"primary"}
            icon={<AddIcon/>}
            isEnable={isEnable}
        />
    )
}

export default CustomButton;
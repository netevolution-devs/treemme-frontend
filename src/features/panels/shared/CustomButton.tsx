import {Button, CircularProgress, type SxProps} from "@mui/material";
import {useTranslation} from "react-i18next";
import type {ReactNode} from "react";
import AddIcon from "@mui/icons-material/Add";
import {PrintRounded} from "@mui/icons-material";

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
    minHeight?: number;
    sx?: SxProps;
    disableIcon?: boolean;
}

const CustomButton = ({
                          label,
                          onClick,
                          color,
                          isSubmit = false,
                          isEnable = true,
                          isLoading = false,
                          disableIcon = false,
                          icon,
                          variant = "outlined",
                          minWidth = 100,
                          minHeight = 30,
                          sx
                      }: CustomButtonProps) => {
    const {t} = useTranslation(["common"]);

    return (
        <Button
            variant={variant}
            onClick={onClick}
            color={color}
            size="small"
            startIcon={isLoading ? <CircularProgress size={16} color="inherit"/> : (label && icon)}
            loading={isLoading}
            sx={{
                height: "100%",
                minHeight: minHeight,
                minWidth: minWidth,
                fontWeight: 'bold',
                textTransform: 'none',
                ...sx
            }}
            type={isSubmit ? "submit" : "button"}
            disabled={!isEnable || isLoading}
        >
            {label
                ? t(label)
                : disableIcon
                    ? <></>
                    : icon
            }
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

interface PrintButtonProps {
    canPrint: boolean;
    isPending: boolean;
    onClick: () => void;
}

export const PrintButton = ({canPrint, isPending, onClick}: PrintButtonProps) => {
    return (
        <CustomButton
            label={""}
            minWidth={60}
            color={"primary"}
            icon={<PrintRounded fontSize={"small"}/>}
            isEnable={canPrint && !isPending}
            isLoading={isPending}
            disableIcon={isPending}
            onClick={() => onClick()}
        />
    )
}

export default CustomButton;
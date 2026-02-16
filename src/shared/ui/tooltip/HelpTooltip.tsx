import {Tooltip, IconButton, type TooltipProps, type IconButtonProps as MUIIconButtonProps} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type {ReactNode} from "react";

interface Props {
    text: string | ReactNode;
    placement?: TooltipProps['placement'];
    size?: 'small' | 'medium' | 'large';
    color?: MUIIconButtonProps["color"];
}

const HelpTooltip = ({text, placement = 'top', size = 'small', color = 'default'}:Props) => {
    return (
        <Tooltip
            title={<>{text}</>}
            placement={placement}
            enterTouchDelay={0}
            arrow
        >
            <IconButton size={size} color={color} sx={{padding: '-2px'}}>
                <HelpOutlineIcon fontSize={size}/>
            </IconButton>
        </Tooltip>
    );
};

export default HelpTooltip;

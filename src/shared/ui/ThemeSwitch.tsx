import {IconButton, useTheme, Box, Typography} from '@mui/material';
import {Brightness4, Brightness7} from '@mui/icons-material';
import {useThemeMode} from "@themes/ThemeModeProvider.tsx";
import {useTranslation} from 'react-i18next';

interface Props {
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}

export const ThemeSwitch = ({size = 'medium', showText = true}: Props) => {
    const theme = useTheme();
    const {themeMode, toggleTheme} = useThemeMode();
    const {t} = useTranslation('common');

    const targetMode = themeMode === 'light' ? 'dark' : 'light';
    const ariaLabel = t('theme.switch-to-mode', {mode: t(`theme.mode.${targetMode}`)});

    const button = (
        <IconButton
            onClick={toggleTheme}
            color="inherit"
            size={size}
            aria-label={ariaLabel}
            sx={{
                color: theme.palette.action.active,
                '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'scale(1.12)',
                },
            }}
        >
            {themeMode === 'light' ? <Brightness4/> : <Brightness7/>}
        </IconButton>
    );

    if (!showText) {
        return button;
    }

    return (
        <Box component="span"
             sx={{display: 'inline-flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary}}>
            {button}
            {showText &&
                <Typography variant="body2" color={"textSecondary"}>
                    {ariaLabel}
                </Typography>
            }
        </Box>
    );
};

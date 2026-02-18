import { styled } from '@mui/material/styles';

// Default theme for Dockview
import 'dockview/dist/styles/dockview.css';

export const StyledDockviewWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    width: '100%',

    // Override main CSS variables of Dockview
    '& .dockview-theme-mui': {
        '--dv-pane-background-color': theme.palette.background.default,
        '--dv-group-view-background-color': theme.palette.background.paper,
        '--dv-separator-border-color': theme.palette.divider,
        '--dv-tabs-and-actions-container-background-color': theme.palette.background.default,
        '--dv-activegroup-visiblepanel-tab-background-color': theme.palette.background.paper,
        '--dv-inactivegroup-visiblepanel-tab-background-color': theme.palette.background.paper,
        '--dv-separator-border': `${theme.palette.divider}`,
        '--dv-activegroup-hiddenpanel-tab-background-color': theme.palette.background.paper,
        '--dv-color-abyss': theme.palette.background.paper,

        // Tabs
        '& .dv-tab': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.secondary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(['background-color', 'color']),

            '&:hover': {
                backgroundColor: theme.palette.action.hover,
            },

            '&.dv-active-tab': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                fontWeight: theme.typography.fontWeightBold,
            },
        },

        // Splitter
        '& .dv-separator': {
            backgroundColor: theme.palette.divider,
            '&:hover': {
                backgroundColor: theme.palette.primary.light,
            }
        },

        // Drop Target
        '& .dv-drop-target-container .dv-drop-target': {
            backgroundColor: `${theme.palette.primary.main}33`, // 20% opacity
            outline: `2px dashed ${theme.palette.primary.main}`,
        }
    }
}));
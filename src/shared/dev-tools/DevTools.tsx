import {useState} from 'react';
import {Box, Fab, Drawer, Typography, Paper, Divider} from '@mui/material';
import {Build as BuildIcon} from '@mui/icons-material';
import DevToolsSwitch from "@shared/dev-tools/DevToolsSwitch.tsx";
import UiControls from "@ui/UiControls.tsx";

interface FeatureFlags {
    skipOtp: boolean;
    skipAuth: boolean;
    apiDelay: boolean;
    useBlueTheme: boolean;
}

const defaultFlags: FeatureFlags = {
    skipOtp: false,
    skipAuth: false,
    apiDelay: false,
    useBlueTheme: true,
};

const STORAGE_KEY = 'dev-tools-flags';

// Load flags from localStorage or use defaults
const loadFlags = (): FeatureFlags => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return {...defaultFlags, ...JSON.parse(stored)};
        }
    } catch (error) {
        console.error('Failed to load dev flags from localStorage:', error);
    }
    return {...defaultFlags};
};

// Save flags to localStorage
const saveFlags = (flags: FeatureFlags) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
        console.error('Failed to save dev flags to localStorage:', error);
    }
};

let currentFlags: FeatureFlags = loadFlags();

export const DevTools = () => {
    const [open, setOpen] = useState(false);
    const [flags, setFlags] = useState<FeatureFlags>(currentFlags);

    // Only render in development
    if (!import.meta.env.DEV) {
        return null;
    }

    const handleToggle = (flag: keyof FeatureFlags) => {
        const newFlags = {...flags, [flag]: !flags[flag]};
        setFlags(newFlags);
        currentFlags = newFlags;
        saveFlags(newFlags);
        
        if (flag === 'skipAuth') {
            window.location.reload();
        }
    };

    return (
        <>
            <Fab
                color="secondary"
                aria-label="dev tools"
                size="small"
                sx={{
                    position: 'fixed',
                    bottom: 13,
                    right: 73,
                    zIndex: 9999,
                    height: 48,
                    width: 48,
                }}
                onClick={() => setOpen(!open)}
            >
                <BuildIcon/>
            </Fab>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 350,
                        padding: 2,
                    },
                }}
            >
                <Box>
                    <Typography variant="h6" gutterBottom>
                        🛠️ Dev Tools
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Development Mode Only
                    </Typography>

                    <Paper elevation={1} sx={{p: 2, mb: 2}}>
                        <Typography variant="subtitle2" gutterBottom>
                            Ui commands
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{mb: 2}}>
                            Toggle various UI states
                        </Typography>
                        <UiControls showLogoutButton={false}/>
                    </Paper>

                    <Divider sx={{my: 2}}/>

                    <Paper elevation={1} sx={{p: 2, mb: 2}}>
                        <Typography variant="subtitle2" gutterBottom>
                            Feature Flags
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{mb: 2}}>
                            Toggle feature flags to test different scenarios
                        </Typography>

                        <DevToolsSwitch
                            value={flags.skipOtp}
                            onChange={() => handleToggle('skipOtp')}
                            title="Skip OTP"
                            description="Skips any otp operation on login"
                        />

                        <DevToolsSwitch
                            value={flags.skipAuth}
                            onChange={() => handleToggle('skipAuth')}
                            title="Skip Auth"
                            description="Bypasses login and provides a mock user context (requires page reload)"
                        />

                        <DevToolsSwitch
                            value={flags.apiDelay}
                            onChange={() => handleToggle('apiDelay')}
                            title="Add Api Delay"
                            description="adds 5 second delay to all api calls"
                        />

                        <DevToolsSwitch
                            value={flags.useBlueTheme}
                            onChange={() => handleToggle('useBlueTheme')}
                            title="Use Blue Theme"
                            description="switches primary color to blue (requires page reload)"
                        />
                    </Paper>

                    <Typography variant="caption" color="text.secondary">
                        💡 Tip: Changes persist across sessions
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
};

// Export getter for other modules to check flags
export const getDevFlags = (): FeatureFlags => currentFlags;

// Export setter for manual flag updates
export const setDevFlag = (flag: keyof FeatureFlags, value: boolean) => {
    currentFlags = {...currentFlags, [flag]: value};
    saveFlags(currentFlags);
};

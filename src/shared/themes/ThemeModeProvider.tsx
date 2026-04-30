import React, {createContext, useContext, useEffect, useState} from 'react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {type ThemeMode} from './defaultThemeGlobal';
import {type Theme} from "@emotion/react";

interface ThemeContextType {
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface CustomThemeProviderProps {
    themes: Record<ThemeMode, Theme>;
    children: React.ReactNode;
}

function useThemeMode() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useThemeMode must be used within a CustomThemeProvider');
    return ctx;
}

const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({children, themes}) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('themeMode') as ThemeMode) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    const toggleTheme = () => setThemeMode((prev: ThemeMode) => (prev === 'light' ? 'dark' : 'light'));

    const value: ThemeContextType = {themeMode, toggleTheme, setThemeMode};

    return (
        <ThemeContext.Provider value={value}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export {CustomThemeProvider, useThemeMode};


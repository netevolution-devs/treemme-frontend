import {createTheme, type Theme, type ThemeOptions} from '@mui/material/styles';


const getPrimaryColors = () => {
    return {
        main: '#2b98ea',
        dark: '#41689b',
        light: '#5590c3',
    };
};

const baseTheme: ThemeOptions = {
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                html: {
                    "WebkitFontSmoothing": "antialiased",
                    "MozOsxFontSmoothing": "grayscale",
                    height: "100%",
                    width: "100%",
                },
                body: {
                    // Custom thin golden scrollbar for all scrollable elements
                    '*::-webkit-scrollbar': {
                        width: '12px',
                    },
                    '*::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.divider,
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '3px',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                    // Firefox scrollbar
                    '*': {
                        scrollbarWidth: 'auto',
                        scrollbarColor: `${theme.palette.primary.main} transparent`,
                    },
                }
            }),
        },

        MuiTypography: {
            styleOverrides: {
                root: {
                    // Prefer breaking long words anywhere to avoid layout overflow
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    // In flex containers, allow text to actually shrink and ellipsize
                    minWidth: 0,
                },
                // Override specific variants with custom sizes
                h1: {
                    fontSize: '2.5rem', // Default: 6rem
                    '@media (max-width:600px)': {
                        fontSize: '2rem',
                    },
                },
                h2: {
                    fontSize: '2rem', // Default: 3.75rem
                    '@media (max-width:600px)': {
                        fontSize: '1.75rem',
                    },
                },
                h3: {
                    fontSize: '1.75rem', // Default: 3rem
                    '@media (max-width:600px)': {
                        fontSize: '1.5rem',
                    },
                },
                h4: {
                    fontSize: '1.5rem', // Default: 2.125rem
                    '@media (max-width:600px)': {
                        fontSize: '1.25rem',
                    },
                },
                h5: {
                    fontSize: '1.20rem', // Default: 1.5rem
                },
                h6: {
                    fontSize: '1.125rem', // Default: 1.25rem
                },
                subtitle1: {
                    fontSize: '1rem', // Default: 1rem
                },
                subtitle2: {
                    fontSize: '0.875rem', // Default: 0.875rem
                },
                body1: {
                    fontSize: '0.9rem', // Default: 1rem
                },
                body2: {
                    fontSize: '0.875rem', // Default: 0.875rem
                },
                button: {
                    fontSize: '0.875rem', // Default: 0.875rem
                },
                caption: {
                    fontSize: '0.75rem', // Default: 0.75rem
                },
                overline: {
                    fontSize: '0.75rem', // Default: 0.75rem
                },
            },
            variants: [
                {
                    // Ensure consistent ellipsis behavior whenever noWrap is used
                    props: {noWrap: true},
                    style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // Important for flex items with constrained width
                        minWidth: 0,
                        // Prevent accidental whitespace breaking in single-line truncation
                        whiteSpace: 'nowrap',
                    },
                },
            ],
        },

        MuiSwitch: {
            styleOverrides: {
                track: (props) => ({
                        backgroundColor: props.theme.palette.action.disabledBackground,
                        opacity: 1,
                    }
                )
            },
        },

        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    transition: "transform",
                    ":hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.12)"
                    },
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
            styleOverrides: {
                root: (props) => ({
                    width: "100%",
                    '& .Mui-disabled': {
                        color: props.theme.palette.text.disabled,
                    },
                    '& .Mui-disabled .MuiAutocomplete-popupIndicator': {
                        display: 'none',
                    },
                })
            }
        },

        MuiInputBase: {
            styleOverrides: {
                input: {
                    paddingTop: '4px !important',
                    paddingBottom: '4px !important',
                }
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    paddingTop: '4px !important',
                    paddingBottom: '4px !important',
                },
                root: {
                    '& .MuiInputAdornment-root': {
                        marginTop: '0 !important',
                        marginBottom: '0 !important',
                        '& .MuiIconButton-root': {
                            padding: '2px', // Reduce padding for icons in inputs (e.g., date picker)
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.2rem', // Reduce icon size from default 1.5rem
                            }
                        }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        '& legend': {
                            fontSize: '0.7em',
                        }
                    }
                }
            }
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    transform: 'translate(14px, 5px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                    },
                },
                sizeSmall: {
                    transform: 'translate(14px, 5px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                    },
                }
            }
        },

        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginTop: '0px',
                    marginLeft: '4px',
                    marginRight: '4px',
                    lineHeight: '1',
                    minHeight: '1em',
                }
            }
        },

        MuiAutocomplete: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                inputRoot: {
                    paddingTop: '0px !important',
                    paddingBottom: '0px !important',
                    '& .MuiAutocomplete-input': {
                        padding: '4px 4px !important',
                    }
                }
            }
        },

        MuiListItem: {
            defaultProps: {
                disablePadding: true,
            },
        },

        MuiCheckbox: {
            defaultProps: {
                disableRipple: true,
            }
        }
    },
};

const lightTheme: Theme = createTheme({
    shape: {
        borderRadius: 4,
    },
    typography: {
        fontFamily: `'Noto Sans', sans-serif`,
    },
    palette: {
        mode: 'light',
        primary: getPrimaryColors(),
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
            contrastText: '#ffffff',
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f7f8fa',
            paper: '#ffffff',
            topBar: '#ffffff',
            card: {
                default: '#ffffff',
                notSelected: '#ececec'
            }
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
            disabled: 'rgba(15,23,42,0.38)',
        },
        tableColors: {
            tableRow1: '#f7f8fa',
            tableRow2: '#ededed',
            border: '#e2e8f0',
            hover: 'rgba(2,6,23,0.04)',
        },
        action: {
            hover: 'rgba(2,6,23,0.04)',
            selected: 'rgba(2,6,23,0.08)',
            disabledBackground: 'rgba(2,6,23,0.06)',
            disabled: 'rgba(15,23,42,0.38)',
        },
        divider: '#e2e8f0',
    },
    components: {
        ...baseTheme.components,
        MuiChip: {
            defaultProps: {
                variant: "filled",
            },
            variants: [
                {
                    props: {variant: "filled"},
                    // @ts-expect-error style works correctly
                    style: ({theme}) => ({
                        color: theme.palette.text,
                        backgroundColor: theme.palette.primary.light
                    })
                },
            ]
        },

        MuiButton: {
            variants: [
                {
                    props: {variant: "outlined"},
                    style: {
                        borderColor: "inherit",
                    }
                }
            ]
        },
    }
});

const darkTheme: Theme = createTheme({
    shape: {
        borderRadius: 4,
    },
    typography: {
        fontFamily: 'Noto Sans, sans-serif',
    },
    palette: {
        mode: 'dark',
        primary: getPrimaryColors(),
        background: {
            default: '#1e1e1e',
            paper: '#151414',
            topBar: '#1b1f24',
            card: {
                default: "#151414",
                notSelected: "#080808"
            }
        },
        text: {
            primary: 'rgba(255,255,255,0.92)',
            secondary: 'rgba(255,255,255,0.65)',
            disabled: 'rgba(255,255,255,0.38)',
        },
        tableColors: {
            tableRow1: '#121212',
            tableRow2: '#1e1e1e',
            border: '#2f363d',
            hover: 'rgba(255,255,255,0.06)',
        },
        action: {
            hover: 'rgba(255,255,255,0.06)',
            selected: 'rgba(255,255,255,0.10)',
            disabledBackground: 'rgba(255,255,255,0.12)',
            disabled: 'rgba(255,255,255,0.38)',
        },
        divider: '#545759',
    },
    components: {
        MuiChip: {
            defaultProps: {
                variant: "outlined"
            }
        },
        ...baseTheme.components,
    }
});

export type ThemeMode = 'light' | 'dark';
export const THEMES: Record<ThemeMode, Theme> = {
    light: lightTheme,
    dark: darkTheme,
};

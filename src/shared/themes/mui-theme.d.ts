import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface PaletteBackground {
        topBar: string;
        card: {
            default: string;
            notSelected: string;
        }
    }

    interface TypeBackground {
        topBar: string;
        card: {
            default: string;
            notSelected: string;
        }
    }

    interface Palette {
        tableColors: {
            tableRow1: string;
            tableRow2: string;
            border: string;
            hover: string;
        };
    }

    interface PaletteOptions {
        tableColors?: {
            tableRow1?: string;
            tableRow2?: string;
            border?: string;
            hover?: string;
        };
    }
}

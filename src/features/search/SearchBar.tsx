import {InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxWidth?: number;
}

function SearchBar({
                       value,
                       onChange,
                       placeholder = "...",
                       maxWidth = 400
                   }: SearchBarProps) {
    const handleClear = () => {
        onChange("");
    }

    return (
        <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            sx={{maxWidth: maxWidth, mb: {xs: 2, md: 0}, width: 350, height: 30}}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            {value.length > 0 && <ClearIcon
                                sx={{cursor: "pointer", mr: 0.2}}
                                onClick={() => handleClear()}
                            />}
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                    sx: {height: 30, pr: 1},
                    slotProps: {
                        input: {sx: {p: 0, pl: 1.2}},
                    }
                },
            }}
        />
    );
}

export default SearchBar;

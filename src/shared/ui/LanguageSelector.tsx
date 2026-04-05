import {useTranslation} from 'react-i18next';
import {
    type SelectChangeEvent,
    FormControl,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import {Language as LanguageIcon} from '@mui/icons-material';
import {setLanguage} from "@helpers/languageDetection";

interface Props {
    showIcon?: boolean
}

const languageOptions = [
    {code: 'en', label: 'English', flag: '🇬🇧'},
    {code: 'it', label: 'Italiano', flag: '🇮🇹'}
];

const LanguageSelector = ({showIcon = true}: Props) => {
    const {i18n} = useTranslation();

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const languageCode = event.target.value;
        setLanguage(languageCode);
        if (!import.meta.env.DEV) window.location.reload();
    };

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <FormControl sx={{height: '100%'}}>
                <Select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    size="medium"
                    sx={{
                        minWidth: 20,
                        padding: '2x 12px',
                        '& .MuiSelect-select': {py: 0.5},
                    }}
                    renderValue={(selected) => {
                        const option = languageOptions.find(opt => opt.code === selected);
                        return option ? (
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <span>{option.flag}</span>
                                <Typography variant="body2">{option.label}</Typography>
                            </Box>
                        ) : selected;
                    }}
                >
                    {languageOptions.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <span>{option.flag}</span>
                                <Typography>{option.label}</Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {showIcon && <LanguageIcon sx={{color: 'text.secondary'}}/>}
        </Box>
    );
};

export default LanguageSelector;

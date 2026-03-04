import React, {type ReactNode, type SyntheticEvent, useState} from 'react';
import {Box, Tabs, Tab} from '@mui/material';

interface TabItem {
    label: string;
    component: ReactNode;
}

interface GenericTabContentProps {
    tabs: TabItem[];
}

function CustomTabPanel(props: { children?: ReactNode; value: number; index: number }) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{pt: 2}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const GenericTabContent: React.FC<GenericTabContentProps> = ({tabs}) => {
    const [value, setValue] = useState<number>(0);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%', mt: -1.7}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="generic tabs">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {tab.component}
                </CustomTabPanel>
            ))}
        </Box>
    );
};

export default GenericTabContent;
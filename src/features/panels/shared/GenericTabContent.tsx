import React, {type ReactNode, type SyntheticEvent, useState} from 'react';
import {Box, Tabs, Tab, Card} from '@mui/material';

interface TabItem {
    label: string;
    component: ReactNode;
}

interface GenericTabContentProps {
    tabs: TabItem[];
    value?: number;
    onChange?: (_: SyntheticEvent, newValue: number) => void;
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
                <Box sx={{pt: 0.5}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const GenericTabContent: React.FC<GenericTabContentProps> = ({tabs, value: externalValue, onChange: externalOnChange}) => {
    const [internalValue, setInternalValue] = useState<number>(0);

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        if (externalOnChange) {
            externalOnChange(event, newValue);
        }
    };

    return (
        <Box sx={{width: '100%'}}>
            <Card variant={"outlined"} sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="generic tabs" textColor="primary" indicatorColor="primary">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Card>
            {tabs.map((tab, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {tab.component}
                </CustomTabPanel>
            ))}
        </Box>
    );
};

export default GenericTabContent;
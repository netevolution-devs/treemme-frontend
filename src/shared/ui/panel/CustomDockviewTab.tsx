import React from 'react';
import {DockviewDefaultTab, type IDockviewDefaultTabProps} from "dockview";

const CustomDockviewTab: React.FC<IDockviewDefaultTabProps> = (props) => {

    const handleMouseDownCapture = (event: React.MouseEvent) => {
        if (event.button === 1) {
            event.preventDefault();
            event.stopPropagation();

            props.api.close();
        }
    };

    return (
        <div
            onMouseDownCapture={handleMouseDownCapture}
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
            <DockviewDefaultTab {...props} />
        </div>
    );
};

export default CustomDockviewTab;
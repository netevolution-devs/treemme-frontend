import React from 'react';
import {DockviewDefaultTab, type IDockviewDefaultTabProps} from "dockview";

const CustomDockviewTab: React.FC<IDockviewDefaultTabProps> = (props) => {

    const handleMouseDownCapture = (event: React.MouseEvent) => {
        // Controlliamo se è il tasto centrale (1)
        if (event.button === 1) {
            // Fermiamo la propagazione agli altri listener di Dockview
            event.preventDefault();
            event.stopPropagation();

            console.log("Cliccato con il tasto centrale");

            // Chiudiamo il pannello
            props.api.close();
        }
    };

    return (
        <div
            onMouseDownCapture={handleMouseDownCapture}
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
        >
            {/* Usiamo il componente originale per mantenere lo stile identico */}
            <DockviewDefaultTab {...props} />
        </div>
    );
};

export default CustomDockviewTab;
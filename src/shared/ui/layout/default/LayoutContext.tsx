import {createContext, useContext, useState, type ReactNode} from "react";

type LayoutContextType = {
    showNavBar: boolean;
    setShowNavBar: (value: boolean) => void;
    showTopBar: boolean;
    setShowTopBar: (value: boolean) => void;
    topBarComponent: (() => ReactNode) | null;
    setTopBarComponent: (component: (() => ReactNode) | null) => void;
    enableBackNavigation?: boolean;
    setEnableBackNavigation: (value: boolean) => void;
    pageName: string;
    setPageName: (value: string) => void;
    backPath: string;
    setBackPath: (value: string) => void;
};

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
};

function LayoutProvider({children}: { children: ReactNode }) {
    const [showNavBar, setShowNavBar] = useState<boolean>(true);
    const [showTopBar, setShowTopBar] = useState<boolean>(true);
    const [topBarComponent, setTopBarComponent] = useState<(() => ReactNode) | null>(null);
    const [enableBackNavigation, setEnableBackNavigation] = useState<boolean>(false);
    const [pageName, setPageName] = useState<string>("");
    const [backPath, setBackPath] = useState<string>("");

    return (
        <LayoutContext.Provider
            value={{
                showNavBar,
                setShowNavBar,
                showTopBar,
                setShowTopBar,
                topBarComponent,
                setTopBarComponent,
                enableBackNavigation,
                setEnableBackNavigation,
                pageName,
                setPageName,
                backPath,
                setBackPath
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
}

export default LayoutProvider;

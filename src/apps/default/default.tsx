import {BrowserRouter} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "@features/auth/model/AuthContext.tsx";
import {CustomThemeProvider as ThemeProvider} from "@themes/ThemeModeProvider.tsx";
import {SnackbarProvider} from "@api/ResponseMessageContext.tsx";
import {THEMES} from "@themes/defaultThemeGlobal.ts";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import LayoutProvider from "@ui/layout/default/LayoutContext.tsx";
import {DevTools} from "@shared/dev-tools/DevTools.tsx";
import RoutingDefault from "@features/routing/default/RoutingDefault.tsx";

const queryClient = new QueryClient();

export default function Default() {

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider themes={THEMES}>
                        <SnackbarProvider>
                            <LayoutProvider>
                                <RoutingDefault/>
                                {import.meta.env.DEV && (
                                    <DevTools/>
                                )}
                            </LayoutProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

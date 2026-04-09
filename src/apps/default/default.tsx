import {BrowserRouter} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "@features/auth/model/AuthContext";
import {CustomThemeProvider as ThemeProvider} from "@themes/ThemeModeProvider";
import {SnackbarProvider} from "@api/ResponseMessageContext";
import {THEMES} from "@themes/defaultThemeGlobal";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import LayoutProvider from "@ui/layout/default/LayoutContext";
import {DevTools} from "@shared/dev-tools/DevTools";
import RoutingDefault from "@features/routing/default/RoutingDefault";

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

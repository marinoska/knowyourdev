import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiClient as client, UNAUTHORIZED } from "./client.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import Loader from "@/components/Loader.tsx";

const AuthContext = React.createContext(null);
//
// export const useAuthContext = () => {
//     return useContext(AuthContext);
// };

export function ApiClientProvider({children}: { children: ReactNode }) {
    const {isAuthenticated, logout, getAccessTokenSilently} = useAuth0();
    const [isFethingAccessToken, setFetchingAccessToken] = useState(isAuthenticated);
    const [error, setError] = useState('');

    const fetchAccessToken = useCallback(async () => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
                    // scope: 'openid profile email'
                },
                detailedResponse: true
            });

            client.setAccessToken(accessToken.access_token);
        } catch (e) {
            console.error('Get access token error:', e);
            setError('API access error:' + (e instanceof Error ? e.message : e?.toString()));
        }
        setFetchingAccessToken(false);
    }, [getAccessTokenSilently, setError]);

    useEffect(() => {
        if (isAuthenticated) {
            client.setOnError(({status}) => {
                if (status === UNAUTHORIZED) {
                    // Unauthorized
                    void logout();
                }
            });

            void fetchAccessToken();
        }
    }, [fetchAccessToken, getAccessTokenSilently, isAuthenticated, logout]);

    const context = null;

    if (isFethingAccessToken) {
        return <Loader/>;
    }

    return (<>
            {error && <Snackbar type="danger" msg={error} onClose={() => setError('')}/>}
            <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
        </>
    );
}

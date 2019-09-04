import React, { useState, useContext, createContext } from "react";
import axios from "axios";

import {makeApiUrl} from '../config/apiConfig';


const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [status, setStatus] = useState({
        token: localStorage.getItem("authToken"),
        error: undefined,
        isInProgress: undefined,
        isSuccess: undefined,
        isChecking: undefined
    });

    if (status.token && !status.isSuccess && !status.isChecking) {
        setStatus({ isChecking: true });

        axios
            .get(makeApiUrl("/api/auth/users/me/"), {
                headers: { Authorization: "Token " + status.token }
            })
            .then(() => setStatus({ ...status, isSuccess: true }))
            .catch(reason => {
                localStorage.removeItem("authToken");
                setStatus({});
            });
    }

    const login = (username, password) => {
        setStatus({ isInProgress: true });

        axios
            .post(makeApiUrl("/api/auth/token/login"), {
                username,
                password
            })
            .then(response => {
                let authToken = response.data && response.data.auth_token;

                if (authToken) {
                    localStorage.setItem("authToken", authToken);
                    setStatus({ token: authToken, isSuccess: true });
                } else {
                    setStatus({ error: "Something went wrong." });
                }
            })
            .catch(reason => {
                let errorMsg =
                    reason.response &&
                    reason.response.data &&
                    reason.response.data.non_field_errors;
                errorMsg = errorMsg || reason.message;
                errorMsg = errorMsg || "Something went wrong.";
                setStatus({ error: errorMsg });
            });
    };

    const logout = () => {
        axios
            .post(makeApiUrl("/api/auth/token/logout"), null, {
                headers: { Authorization: "Token " + status.token }
            })
            .then(response => {
                localStorage.removeItem("authToken");
                setStatus({});
            });
    };

    return {
        ...status,
        login,
        logout
    };
}

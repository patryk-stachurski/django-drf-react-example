import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import {makeApiUrl} from "../config/apiConfig";


const registrationContext = createContext();

export function ProvideRegistration({ children }) {
    const registration = useProvideRegistration();
    return (
        <registrationContext.Provider value={registration}>
            {children}
        </registrationContext.Provider>
    );
}

export const useRegistration = () => {
    return useContext(registrationContext);
};

function useProvideRegistration() {
    const [status, setStatus] = useState({
        isInProgress: undefined,
        isSuccess: undefined,
        isError: undefined,
        usernameErrors: undefined,
        passwordErrors: undefined,
        genericErrorMsg: undefined
    });

    const register = (username, password) => {
        setStatus({ isInProgress: true });

        axios
            .post(makeApiUrl("/api/auth/users/"), { username, password })
            .then(() =>
                setStatus({
                    isSuccess: true
                })
            )
            .catch(reason => {
                const areFieldsInvalid =
                    reason.response &&
                    reason.response.data &&
                    Object.keys(reason.response.data).length > 0;

                let newStatus = { isError: true };

                if (areFieldsInvalid) {
                    const data = reason.response.data;

                    newStatus.usernameErrors = data.username;
                    newStatus.passwordErrors = data.password;
                } else {
                    let msg = reason.response && reason.response.statusText;
                    msg = msg || reason.message || "Something went wrong!";

                    newStatus.genericErrorMsg = msg;
                }

                setStatus(newStatus);
            });
    };

    const reset = () => setStatus({});

    return {
        ...status,
        register,
        reset
    };
}

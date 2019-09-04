import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import {makeApiUrl} from "../config/apiConfig";

const singlePostContext = createContext();

export function ProvideSinglePost({ children }) {
    const singlePost = useProvideSinglePost();
    return (
        <singlePostContext.Provider value={singlePost}>
            {children}
        </singlePostContext.Provider>
    );
}

export const useSinglePost = () => {
    return useContext(singlePostContext);
};

function useProvideSinglePost() {
    const [status, setStatus] = useState({
        isLoading: undefined,
        isSuccess: undefined,
        error: undefined,
        data: undefined
    });

    const load = ({ id, authToken }) => {
        setStatus({ isLoading: true });

        let config = {};
        if (authToken) {
            config.headers = { Authorization: "Token " + authToken };
        }

        axios
            .get(makeApiUrl(`/api/posts/${id}`), config)
            .then(response => {
                const data = response.data;

                setStatus({
                    isSuccess: true,
                    data
                });
            })
            .catch(reason => {
                let msg =
                    reason.response &&
                    reason.response.data &&
                    reason.response.data.detail;
                msg = msg || (reason.response && reason.response.statusText);
                msg = msg || "Something went wrong!";

                setStatus({ error: msg });
            });
    };

    return {
        load,
        ...status
    };
}

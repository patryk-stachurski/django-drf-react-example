import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import {makeApiUrl} from "../config/apiConfig";


const createPostContext = createContext();

export function ProvideCreatePost({ children }) {
    const createPost = useProvideCreatePost();
    return (
        <createPostContext.Provider value={createPost}>
            {children}
        </createPostContext.Provider>
    );
}

export const useCreatePost = () => {
    return useContext(createPostContext);
};

function useProvideCreatePost() {
    const [status, setStatus] = useState({
        isInProgress: undefined,
        isSuccess: undefined,
        isError: undefined,
        titleErrors: undefined,
        genericErrorMsg: undefined,
        createPostId: undefined
    });

    const create = ({ title, imageFile, isPrivate, authToken }) => {
        setStatus({ isInProgress: true });

        const formData = new FormData();
        formData.append(
            "data",
            JSON.stringify({ title, is_private: isPrivate })
        );
        formData.append("image", imageFile);
        formData.append("title", title);

        axios
            .post(makeApiUrl("/api/user-posts/"), formData, {
                headers: { Authorization: "Token " + authToken },
                body: imageFile
            })
            .then(response =>
                setStatus({
                    createdPostId: response.data.id,
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
        status,
        create,
        reset
    };
}

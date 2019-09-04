import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import {makeApiUrl} from "../config/apiConfig";

const listPostsContext = createContext();

export function ProvideListPosts({ children }) {
    const listPosts = useProvideListPosts();
    return (
        <listPostsContext.Provider value={listPosts}>
            {children}
        </listPostsContext.Provider>
    );
}

export const useListPosts = () => {
    return useContext(listPostsContext);
};

function useProvideListPosts() {
    const [status, setStatus] = useState({
        isLoading: undefined,
        isSuccess: undefined,
        isLoadedAll: undefined,
        isError: undefined,
        posts: undefined
    });

    const addPosts = (posts, prevPosts) => {
        const allPosts = (prevPosts || []).concat(posts);
        const allIds = allPosts.map(p => p.id);

        // indexOf will return index of first occurrence
        return allPosts.filter((p, i) => allIds.indexOf(p.id) === i);
    };

    const load = uploadedBefore => {
        setStatus({ isLoading: true, posts: status.posts });

        let config = {};

        if (uploadedBefore) {
            config.params = { uploaded_at__lt: uploadedBefore };
        }

        axios
            .get(makeApiUrl('/api/posts/'), config)
            .then(response => {
                const data = response.data;

                const posts = uploadedBefore
                    ? addPosts(data, status.posts)
                    : data;

                setStatus({
                    isSuccess: true,
                    posts: posts,
                    isLoadedAll: data.length < 20
                });
            })
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

    const getLast = () => status.posts && status.posts.slice(-1)[0];

    const loadMore = () => {
        const lastPost = getLast();

        if (status.isLoadedAll || !lastPost) {
            return;
        }

        load(lastPost.uploaded_at);
    };

    return {
        load,
        loadMore,
        status
    };
}

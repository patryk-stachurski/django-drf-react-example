import React from "react";
import styled from "styled-components";

import CircularProgress from "@material-ui/core/CircularProgress";

import Post from "../components/post";

import colors from '../config/colorsConfig';

import { useSinglePost } from "../hooks/useSinglePost";

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
`;

const Error = styled.div`
    color: ${colors.errorTextColor};
`;

export default function SinglePostScreen(props) {
    const singlePost = useSinglePost();

    const postId = props.match.params.postId;

    const [isStartedLoading, setIsStartedLoading] = React.useState();

    if (!isStartedLoading) {
        singlePost.load({ id: postId });
        setIsStartedLoading(true);
    }

    const isSuccess = isStartedLoading && singlePost.isSuccess;
    const isLoading =
        isStartedLoading && !singlePost.isSuccess && !singlePost.error;
    const isError =
        isStartedLoading && !singlePost.isSuccess && singlePost.error;

    return (
        <Wrapper>
            {isSuccess && <Post {...singlePost.data} />}
            {isLoading && <CircularProgress />}
            {isError && <Error>{singlePost.error}</Error>}
        </Wrapper>
    );
}

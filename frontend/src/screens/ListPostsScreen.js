import React from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

import Post from "../components/post";

import { useListPosts } from "../hooks/useListPosts";

const Wrapper = styled.div`
    margin-top: 25px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    
    background-color: #eeeeee;
    box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.25);
    
    & > div {
      width: 100%;
    }
`;

const EndMessage = styled.div`
  margin: 20px;
  text-align: center;
  font-size: 30px;
`;


const StyledInfiniteScroll = styled(InfiniteScroll)`
    background-color: #eeeeee;
    box-shadow: 0 0 30px 5px rgba(0,0,0,0.25);
    overflow: hidden;
    width: 95%; 
    margin: auto;
`;

export default function ListPostsScreen() {
    const listPosts = useListPosts();

    const status = listPosts.status;
    const posts = status.posts;

    React.useEffect(listPosts.load, []);

    return (
        <Wrapper>
            <StyledInfiniteScroll
                dataLength={(posts && posts.length) || 0}
                next={listPosts.loadMore}
                hasMore={!status.isLoadedAll}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <EndMessage>
                        You've reached the edge of the internet!
                    </EndMessage>
                }
            >
                {(posts || []).map(p => (
                    <Post {...p} key={p.id} />
                ))}
            </StyledInfiniteScroll>
        </Wrapper>
    );
}

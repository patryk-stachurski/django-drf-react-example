import React from "react";
import styled, { keyframes } from "styled-components";

import colors from '../../config/colorsConfig';

export const keyFrameBlinking = keyframes` 
  88% {
    opacity: 1;
  }
  
  90% {
    opacity: 0;
  }
  
  98% {
    opacity: 0;
  }
  
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
    padding: 10px;
    background-color: ${colors.postTitleBgColor};
    border-radius: 5px;
    position: absolute;
    bottom: 10px;
    display: flex;
    margin: 0 10px;

    :hover {
        background-color: ${colors.postTitleBgHoverColor};
        animation: none;
    }
`;

const Text = styled.h3`
    margin: 0;
    text-align: center;
    font-size: 2.5em;
    font-weight: bold;
    text-decoration: none;
    color: ${colors.postTitleTextColor};
    animation: ${keyFrameBlinking} 10s linear 0s infinite;

    @media only screen and (max-width: 600px) {
        font-size: 15px !important;
    }
`;

export default ({ children }) => (
    <Container>
        <Text>{children}</Text>
    </Container>
);

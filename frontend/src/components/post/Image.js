import React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import colors from '../../config/colorsConfig';

const Container = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    min-height: 30vh;
    width: 100%;
    border-radius: 10px;

    @media only screen and (max-width: 600px) {
        height: auto;
    }
`;

const StyledImage = styled.img`
    background: transparent 50% 50% no-repeat / contain;
    height: 100%;
    width: auto;
    max-width: 100%;
    border-radius: 10px;

    @media only screen and (max-width: 600px) {
        height: auto;
        width: 100%;
    }
`;

export default function({ src }) {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <Container>
            {isLoading && <CircularProgress />}
            <StyledImage
                src={src}
                onLoad={() => setIsLoading(false)}
                style={isLoading ? { display: "none" } : {}}
                alt="Post image"
            />
        </Container>
    );
}

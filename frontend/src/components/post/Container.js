import React from "react";
import Container from "@material-ui/core/Container";
import styled from "styled-components";

import colors from '../../config/colorsConfig';

export default styled(Container)`
    display: flex;
    position: relative;
    flex-direction: column;
    border-radius: 10px;
    margin: 50px auto;
    width: fit-content;
    height: 80vh;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 600px) {
        height: auto;
        max-height: 90vh;
    }
`;

import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";

import GridItem from "./GridItem";
import colors from '../../config/colorsConfig';

const StyledContainer = styled(Container)`
    margin-top: 100px;
    padding: 2%;
    border-radius: 5px;
`;

const GenericError = styled.div`
    text-align: center;
    height: 30px;
    color: ${colors.errorTextColor};
`;

export default ({children, title, error, onSubmit, submitDisabled}) => (
    <StyledContainer maxWidth="sm">
        <Paper style={{padding: '15px'}}>
            <Grid
                container
                direction="column"
                justify="center"
                alignContent="center"
                padding={10}
            >
                <Typography variant="h3">{title}</Typography>

                {children}

                <GridItem>
                    <GenericError>{error}</GenericError>
                </GridItem>

                <GridItem item>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        disabled={submitDisabled}
                        onClick={onSubmit}
                    >
                        {title}
                    </Button>
                </GridItem>
            </Grid>
        </Paper>
    </StyledContainer>
);

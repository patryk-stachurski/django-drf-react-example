import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import styled from "styled-components";

import RawLink from "../../components/ui/RawLink";

import {useAuth} from "../../hooks/useAuth";

const Title = styled(Typography)`
    flex-grow: 1;
`;

const NavButton = styled(Button)`
    margin: 5px !important;
    min-width: 100px !important;
    font-weight: bold !important;
`;

const HomeLinkContainer = styled(RawLink)`
    display: flex;
    flex-grow: 1;
    align-items: center;
`;

export default function () {
    const auth = useAuth();

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <HomeLinkContainer to="/">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                        >
                            <SvgIcon>
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </SvgIcon>
                        </IconButton>

                        <Title variant="h6">Home</Title>
                    </HomeLinkContainer>

                    {!auth.isSuccess && (
                        <>
                            <NavButton variant="outlined" color="secondary">
                                <RawLink to="/login">Log in</RawLink>
                            </NavButton>
                            <NavButton variant="contained" color="secondary">
                                <RawLink to="/register">Register</RawLink>
                            </NavButton>
                        </>
                    )}

                    {auth.isSuccess && (
                        <>
                            <NavButton variant="outlined" color="secondary">
                                <RawLink to="/create">Create post</RawLink>
                            </NavButton>
                            <NavButton
                                variant="contained"
                                color="secondary"
                                onClick={auth.logout}
                            >
                                Log out
                            </NavButton>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

import React from "react";
import { hot } from "react-hot-loader/root";

import "./App.css";

import { ProvideAuth } from "./hooks/useAuth.js";
import { ProvideRegistration } from "./hooks/useRegistration";
import { ProvideCreatePost } from "./hooks/useCreatePost";
import { ProvideSinglePost } from "./hooks/useSinglePost";
import { ProvideListPosts } from "./hooks/useListPosts";

import {materialThemePalette} from "./config/colorsConfig";

import TopBar from "./containers/topbar";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router, Route } from "react-router-dom";

import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import SinglePostScreen from "./screens/SinglePostScreen";
import ListPostsScreen from "./screens/ListPostsScreen";

const theme = createMuiTheme({
    palette: materialThemePalette
});

function App() {
    return (
        <Router>
            <ProvideAuth>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <TopBar />

                    <Route path="/login" component={LoginScreen} />

                    <ProvideRegistration>
                        <Route path="/register" component={RegisterScreen} />
                    </ProvideRegistration>

                    <ProvideCreatePost>
                        <Route path="/create" component={CreatePostScreen} />
                    </ProvideCreatePost>

                    <ProvideSinglePost>
                        <Route
                            path="/posts/:postId"
                            exact
                            component={SinglePostScreen}
                        />
                    </ProvideSinglePost>

                    <ProvideListPosts>
                        <Route path="/" exact component={ListPostsScreen} />
                    </ProvideListPosts>
                </ThemeProvider>
            </ProvideAuth>
        </Router>
    );
}

export default hot(App);

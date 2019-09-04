import React from "react";
import { Redirect } from "react-router";

import TextField from "@material-ui/core/TextField";

import GridItem from "../components/ui/GridItem";
import FormContainer from "../components/ui/FormContainer";
import { ifPressedEnter } from "../components/ui/utils";

import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen() {
    const [values, setValues] = React.useState({
        username: "",
        password: ""
    });

    const auth = useAuth();

    if (auth.isSuccess) {
        return <Redirect to="/create" />;
    }

    const handleChange = name => event => {
        if (!auth.isInProgress) {
            setValues({ ...values, [name]: event.target.value });
        }
    };

    const handleSubmit = () => auth.login(values.username, values.password);

    return (
        <FormContainer
            title="Log In"
            error={auth.error}
            onSubmit={handleSubmit}
            submitDisabled={
                auth.isInProgress || (!values.username || !values.password)
            }
        >
            <GridItem>
                <TextField
                    label="Username"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    value={values.username}
                    disabled={auth.isInProgress}
                    onChange={handleChange("username")}
                    onKeyPress={ifPressedEnter(handleSubmit)}
                />
            </GridItem>

            <GridItem>
                <TextField
                    label="Password"
                    type="password"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    value={values.password}
                    disabled={auth.isInProgress}
                    onChange={handleChange("password")}
                    onKeyPress={ifPressedEnter(handleSubmit)}
                />
            </GridItem>
        </FormContainer>
    );
}

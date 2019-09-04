import React from "react";

import { Redirect } from "react-router";

import TextField from "@material-ui/core/TextField";

import FormContainer from "../components/ui/FormContainer";
import GridItem from "../components/ui/GridItem";
import { ifPressedEnter } from "../components/ui/utils";

import { useRegistration } from "../hooks/useRegistration";
import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen() {
    const [values, setValues] = React.useState({
        username: "",
        password: ""
    });

    const registration = useRegistration();
    const auth = useAuth();

    // Redirect to home page if successfully registered
    if (registration.isSuccess) {
        auth.login(values.username, values.password);
        registration.reset();
        return <Redirect to="/create" />;
    }

    const handleChange = name => event => {
        if (!registration.isInProgress) {
            setValues({ ...values, [name]: event.target.value });
        }
    };

    const handleSubmit = () =>
        registration.register(values.username, values.password);

    return (
        <FormContainer
            title="Register account"
            error={registration.genericErrorMsg}
            onSubmit={handleSubmit}
            submitDisabled={
                registration.isInProgress ||
                (!values.username || !values.password)
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
                    disabled={registration.isInProgress}
                    error={Boolean(registration.usernameErrors)}
                    helperText={registration.usernameErrors}
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
                    disabled={registration.isInProgress}
                    error={Boolean(registration.passwordErrors)}
                    helperText={registration.passwordErrors}
                    onChange={handleChange("password")}
                    onKeyPress={ifPressedEnter(handleSubmit)}
                />
            </GridItem>
        </FormContainer>
    );
}

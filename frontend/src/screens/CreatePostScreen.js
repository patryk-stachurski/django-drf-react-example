import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Redirect } from "react-router";

import GridItem from "../components/ui/GridItem";
import FormContainer from "../components/ui/FormContainer";

import { useAuth } from "../hooks/useAuth";
import { useCreatePost } from "../hooks/useCreatePost";

export default function CreatePostScreen() {
    const auth = useAuth();

    const [title, setTitle] = React.useState("");
    const [imageFile, setImageFile] = React.useState();

    const [imagePreview, setImagePreview] = React.useState({
        path: undefined,
        isLoading: undefined
    });

    const createPost = useCreatePost();
    const isInProgress = createPost.status.isInProgress;

    if (!auth.isSuccess && !auth.isChecking && !auth.isInProgress) {
        return <Redirect to="/" />;
    }

    if (createPost.status.isSuccess) {
        createPost.reset();
        return <Redirect to={`/posts/${createPost.status.createdPostId}`} />;
    }

    const handleImage = event => {
        const imageFile = event.target.files[0];

        if (!imageFile) {
            return;
        }

        // Convert file so its name is up to 100 characters and it has extension
        const extension = imageFile.name.split('.').pop();
        const shortenedName = imageFile.name.slice(0, 99 - extension.length) + '.' + extension;

        const imageBlob = imageFile.slice(0, imageFile.size, imageFile.type);
        const convertedImageFile = new File([imageBlob], shortenedName, {type: imageFile.type});

        const reader = new FileReader();
        reader.addEventListener(
            "load",
            () => {
                setImagePreview({ isLoading: false, path: reader.result });
            },
            false
        );

        reader.readAsDataURL(imageFile);
        setImagePreview({ isLoading: true, path: undefined });

        setImageFile(convertedImageFile);
    };

    const handleCreate = () =>
        createPost.create({
            title,
            imageFile: imageFile,
            authToken: auth.token
        });

    return (
        <FormContainer
            title="Create post"
            error={createPost.genericErrorMsg}
            onSubmit={handleCreate}
            submitDisabled={createPost.isInProgress || (!title || !imageFile)}
        >
            <GridItem>
                <TextField
                    label="Title of the post"
                    placeholder="Look on that funny image!"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    disabled={isInProgress}
                />
            </GridItem>

            <GridItem>
                <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImage}
                />
                <label htmlFor="raised-button-file">
                    <Button
                        variant="raised"
                        component="span"
                        fullWidth
                        disabled={isInProgress}
                    >
                        Select image
                    </Button>
                </label>
            </GridItem>

            <GridItem>
                {imagePreview.isLoading && <span>Loading...</span>}

                {imagePreview.path && <img id="img" src={imagePreview.path} />}
            </GridItem>
        </FormContainer>
    );
}

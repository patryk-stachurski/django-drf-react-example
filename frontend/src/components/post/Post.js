import React from "react";

import Container from "./Container";
import Title from "./Title";
import Image from "./Image";

export default ({ id, title, image }) => (
    <Container id={`post-container-${id}`} as="a" href={`/posts/${id}`}>
        <Title>{title}</Title>
        <Image src={image} />
    </Container>
);

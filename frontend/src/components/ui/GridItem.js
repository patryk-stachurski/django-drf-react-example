import Grid from "@material-ui/core/Grid";
import styled from "styled-components";

export default styled(Grid).attrs({ item: true })`
    && {
        width: 100%;
        margin: 8px 0;
    }
`;

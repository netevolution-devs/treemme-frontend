import type {NavigateFunction} from "react-router";

interface Args {
    to: string,
    navigate: NavigateFunction,
}

export const handleTopItemClick = ({to, navigate}: Args) => {
    if (to.startsWith("/")) navigate(to);
    else if (to) window.location.href = to;
};

import { Box, Center, Spinner } from "@chakra-ui/react";

const Loading = () => {
    return(
        <Center height='100%' width='100%'>
            <Spinner></Spinner>
        </Center>
    )
}

export default Loading;
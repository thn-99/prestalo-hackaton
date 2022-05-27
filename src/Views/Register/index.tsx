import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Heading,
    Text,
    Link,
    Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../../Store/User';
export default function Login() {
    const updateAtom = useSetAtom(userAtom);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const emailRef = useRef<null | HTMLInputElement>(null);
    const passwordRef = useRef<null | HTMLInputElement>(null);

    const loginHandler = async () => {
        if (emailRef && passwordRef && emailRef.current && passwordRef.current) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            console.log(email,password);
            axios.post("http://presatlo-service.arbow.yourappname.com/auth/register", { email: email, password: password} )
                .then((response) => { succesfullLoginHandler(response) })
                .catch(() => { alert("Something went wrong") });
        }
    }

    const succesfullLoginHandler = (response:AxiosResponse<any,any>) =>{
        navigate('/login');
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.50'}>

            <Box>
                <Box>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                    <Center>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            and get free 10 prestacoins
                        </Text>
                    </Center>
                </Box>

                <Box boxShadow='base' p='6' rounded='md' bg='white'>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" ref={emailRef} />
                    </FormControl>
                    <FormControl id="password" isRequired mt='2em'>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input type={showPassword ? 'text' : 'password'} ref={passwordRef} />
                            <InputRightElement h={'full'}>
                                <Button
                                    variant={'ghost'}
                                    onClick={() =>
                                        setShowPassword((showPassword) => !showPassword)
                                    }>
                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Center mt='2em'>
                        <Button
                            loadingText="Submitting"
                            size="lg"
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            onClick={loginHandler}
                            >
                            Sign up
                        </Button>
                    </Center>

                    <Center mt='1em'>
                        <Text align={'center'}>
                            Have an account? <Link color={'blue.400'} href="/login">Login</Link>
                        </Text>

                    </Center>

                </Box>
            </Box>

        </Flex>
    );
}

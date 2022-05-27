import { Box, Button, Center, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { calcRelativeAxisPosition } from "framer-motion/types/projection/geometry/delta-calc";
import { useEffect, useRef, useState } from "react";
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import Loading from "../../Components/Loading";
import TransactionCard from "./components/TransactionsCard";
import { useAtom } from "jotai";
import { userAtom } from "../../Store/User";
import { dogeValueVSEurAtom } from "../../Store/Crypto";
import { useAuth } from "../../Hooks/Auth";

// const transactionsMockup:Transaction[] = [
//     {
//       "_id": "628f7c22346f6cddf1b41eb6",
//       "sender_wallet_id": "b6eaed9c-b498-4ea5-b54c-54b204e6c35a",
//       "reciever_wallet_id": "8d205dcb-b70d-445c-b8ac-cd67f851cb93",
//       "amount": 4,
//       "createdAt": "2022-05-26T13:09:54.126Z",
//       "__v": 0
//     },
//     {
//       "_id": "628f7c74c1e1adabe6a6dd3a",
//       "sender_wallet_id": "b6eaed9c-b498-4ea5-b54c-54b204e6c35a",
//       "reciever_wallet_id": "8d205dcb-b70d-445c-b8ac-cd67f851cb93",
//       "amount": 4,
//       "createdAt": "2022-05-26T13:11:16.652Z",
//       "__v": 0
//     },
//     {
//       "_id": "628f7ce5c54af4b6d2db8e22",
//       "sender_wallet_id": "b6eaed9c-b498-4ea5-b54c-54b204e6c35a",
//       "reciever_wallet_id": "8d205dcb-b70d-445c-b8ac-cd67f851cb93",
//       "amount": 4,
//       "createdAt": "2022-05-26T13:13:09.897Z",
//       "__v": 0
//     }
//   ]

export interface Transaction {
    _id: string;
    sender_wallet_id: string;
    reciever_wallet_id: string;
    amount: number;
    createdAt: string;
    __v: number;
}

export interface TransactionByDate {
    date: string,
    transactions: Transaction[],
}

const Dashboard = () => {


    const [dogeValueVSEur, updateDogeValueVSEur] = useAtom(dogeValueVSEurAtom);
    const [coinHistoric, setCoinHistoric] = useState<number[][] | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [chartData, setChartData] = useState<any>(undefined);
    const [user, updateUser] = useAtom(userAtom);
    const [, getAuthHeader] = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const walletSendRef = useRef<null | HTMLInputElement>(null);
    const amountSendRef = useRef<null | HTMLInputElement>(null);


    useEffect(() => {
        getUser();
        getTransactions();
        getCurrentCoinValue();
        getCoinHistoic();
    }, [])



    useEffect(() => {
        if (coinHistoric) {
            const actualDate = new Date();
            const dayOfMonth = actualDate.getDate();
            const labels = coinHistoric.map((element, index) => {
                const newDate = new Date();
                newDate.setDate(dayOfMonth - index)
                return newDate.getDate() + newDate.getMonth();
            });
            console.log(labels);
            const chartData = {
                datasets: [{
                    data: coinHistoric.map(element => element[1]),
                    labels: [],
                }],
                labels: labels
            }
            setChartData(chartData);
        }
    }, [coinHistoric])

    const getUser = async () => {
        if (!user) {
            // const getAuthHeader = getgetAuthHeader;
            const response = await axios.get("http://presatlo-service.arbow.yourappname.com/user", { headers: { ...getAuthHeader() } }).catch(() => { alert("Service unavailable") });
            if (response) updateUser(response.data);
        }
    }

    const getTransactions = async () => {
        const response = await axios.get("http://presatlo-service.arbow.yourappname.com/transactions", { headers: { ...getAuthHeader() } }).catch(() => { alert("Service unavailable") });
        if (response) setTransactions(response.data)
    }

    const getCurrentCoinValue = async () => {
        const result = await axios.get("https://api.coingecko.com/api/v3/coins/dogecoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false");
        const usdConveriosRate = result.data.market_data.current_price.eur;
        updateDogeValueVSEur(usdConveriosRate);
    }

    const getCoinHistoic = async () => {
        const result = await axios.get("https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=usd&days=30&interval=daily");

        const historic = result.data.prices;

        setCoinHistoric(historic);
    }

    const sendCoins = () => {
        if (walletSendRef && walletSendRef.current && amountSendRef && amountSendRef.current) {
            const walletToSendId = walletSendRef.current.value;
            const amountToSend = amountSendRef.current.value;
            if (+amountToSend <= 0) {
                toast({
                    title: 'Only positive values.',
                    description: "Please introduce only positive values.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,

                })
                return;
            }
            if (+amountToSend > user.wallet_amount) {
                toast({
                    title: 'Not enough money.',
                    description: "You are poor.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,

                })
                return;
            }
            axios.post("http://presatlo-service.arbow.yourappname.com/transactions",{recieverWalletId:walletToSendId,amount:amountToSend},{headers:{ ...getAuthHeader() }}).
            then(()=>{window.location.reload()})
            .catch(()=>{toast({
                title: 'Something went wrong',
                description: "Something went wrong",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })})

        } else {
            toast({
                title: 'Incorrect values',
                description: "Fill the values to send",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }


    return (
        <Center bg='blackAlpha.50' width='100%' height='100vh'>
            <Box width={["90%", "70%", "50%", "30%"]}>
                {user && <Text>Wallet Id: {user.wallet_id}</Text>}
                {user && <Text>Coins available: {user.wallet_amount}</Text>}
                <Box position='relative' width='100%'>
                    {chartData ?

                        <Chart type='line' data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { display: false } }, y: { ticks: { display: false } } } }} /> : <Loading />
                    }
                    <Flex flexDirection='column' top='10px' left='10px' position='absolute'>
                        <Text>*** DOGE</Text>
                        <Text>$***</Text>
                        <Text color='green'>(+*** DOGE)</Text>
                    </Flex>
                    <Flex position='absolute' width='100%' justifyContent='space-evenly' bottom='0px'>
                        <Button>Week</Button>
                        <Button>Month</Button>
                        <Button>Year</Button>
                    </Flex>
                </Box>

                <Flex justifyContent='space-around' mt='2em'>
                    <Button size='lg' bg='blue.600' color='white' onClick={onOpen}>Send</Button>
                    <Button size='lg' bg='blue.600' color='white'>Recieve</Button>
                </Flex>
                <Box>
                    {transactions && <TransactionCard transactions={transactions} />}
                </Box>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Send coins</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="wallet_id" isRequired>
                            <FormLabel>Wallet Id</FormLabel>
                            <Input type="text" ref={walletSendRef} />
                        </FormControl>

                        <FormControl id="wallet_id" isRequired>
                            <FormLabel>Amount</FormLabel>
                            <Input type="number" ref={amountSendRef} />
                        </FormControl>

                        <Center>
                            <Button onClick={sendCoins}>Send</Button>
                        </Center>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </Center>
    )
}

export default Dashboard;
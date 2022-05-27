import { Box, Circle, Flex, Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Transaction } from "../..";
import { dogeValueVSEurAtom } from "../../../../Store/Crypto";
import { userAtom } from "../../../../Store/User";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_DIFF_TEXT = ["Today", "Yesterday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// const TransactionCard = ({transactions}:{ transactions:[string, Transaction[]]}) => {
const TransactionCard = ({ transactions }: { transactions: Transaction[] }) => {

    const [transactionsByDate, setTransactionsByDate] = useState<[string, Transaction[]][]>(groupTransactionsInDates(transactions))

    function groupTransactionsInDates(transactions: Transaction[]) {

        const newtransactionsByDates = new Map<string, Transaction[]>();

        const reversedTransactions = [ ...transactions! ].reverse();
        for (let transaction of reversedTransactions) {
            const transactionDate = transaction.createdAt.split('T')[0];
            if (!newtransactionsByDates.has(transactionDate)) {
                newtransactionsByDates.set(transactionDate, []);
            }

            newtransactionsByDates.get(transactionDate)?.push(transaction);
        }
        return Array.from(newtransactionsByDates as Map<string, Transaction[]>);
    }



    //TO-DO incoming date from server is in UTC and nowDate is in local-hour
    const getDateWithDaysDiff = (date: Date) => {
        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);


        const daysDiff = Math.floor((nowDate.getUTCMilliseconds() - date.getMilliseconds()) / MS_PER_DAY);


        const dateToReturnText = MONTH_NAMES[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        if (daysDiff < DAYS_DIFF_TEXT.length) {
            return dateToReturnText + " - " + DAYS_DIFF_TEXT[daysDiff];
        } else if (daysDiff < 30) {
            return dateToReturnText + " - " + daysDiff + " days ago";
        } else {
            return dateToReturnText;
        }
    }


    return (
        <>

            {
                transactionsByDate.map(transactionContainer => {
                    return (
                        <Box mt='2em'>
                            <Text ml={2}>{getDateWithDaysDiff(new Date(transactionContainer[0]))}</Text>
                            {transactionContainer[1].map((value) => <TransactionCardElement transaction={value} key={value._id} />)}

                        </Box>
                    )
                }

                )
            }

        </>
    )
}

const TransactionCardElement = ({ transaction }: { transaction: Transaction }) => {
    const dogeValue = useAtomValue(dogeValueVSEurAtom);
    const user = useAtomValue(userAtom);

    const sender = user.wallet_id === transaction.sender_wallet_id;

    return (
        <Flex p={4} justify='space-between' bg='white' mt={2}>
            <Flex display='flex'>
                <Circle bg='green' size='2em'>
                    {sender ? 'S' : 'R'}
                </Circle>
                <Box ml={2}>
                    <Text>{sender ? 'Sent' : 'Recieved'}</Text>
                    <Text>{sender ? 'Sent' : 'Recieved'} at {transaction.createdAt.split('T')[1].split('.')[0]}</Text>
                </Box>
            </Flex>
            <Box>
                <Text>{sender ? '-' : '+'}{transaction.amount} DODGE</Text>
                <Text>{sender ? '-' : '+'}{transaction.amount * dogeValue} EUR</Text>
            </Box>
        </Flex>
    )
}

export default TransactionCard;
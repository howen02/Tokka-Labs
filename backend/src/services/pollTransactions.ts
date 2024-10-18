import {ETHERSCAN_API_KEY, UNISWAP_ETH_USDC_CONTRACT_ADDRESS} from "../constants";
import db from "../db/db";
import {Transaction} from "../types";

type TransactionResponse = {
    status: string;
    message: string;
    result: Transaction[];
}

const fetchUniswapTransactions =
    ({
        page = 1,
        offset = 100
     } = {}) => {
        const baseUrl = 'https://api.etherscan.io/api';
        const params = new URLSearchParams({
            module: 'account',
            action: 'tokentx',
            address: UNISWAP_ETH_USDC_CONTRACT_ADDRESS,
            page: page.toString(),
            offset: offset.toString(),
            sort: 'desc',
            apikey: ETHERSCAN_API_KEY || ''
        });
        const url = `${baseUrl}?${params.toString()}`;

        return fetch(url)
            .then(res => res.json() as unknown as TransactionResponse)
            .then(transactionResponse => transactionResponse.result)
            .catch(err => Promise.reject(err));
    };

const insertTransactionIntoDb = (transaction: Transaction) =>
    db
    .query("INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, timeStamp) VALUES (?, ?, ?, ?)")
    .run(transaction.hash, transaction.blockNumber, transaction.gasUsed, transaction.timeStamp);

const insertTransactionsIntoDb = (transactions: Transaction[]) =>
    transactions.forEach(insertTransactionIntoDb);

export const pollTransactions = () => {
    const poll = () =>
        fetchUniswapTransactions()
            .then(insertTransactionsIntoDb)
            .then(() => console.log("Fetched recent transactions at", new Date()))
            .catch(err => console.error("Error fetching transactions:", err));

    poll().then();
    setInterval(poll, 1000);
};
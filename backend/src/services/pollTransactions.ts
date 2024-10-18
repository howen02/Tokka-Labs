import {ETHERSCAN_API_KEY, UNISWAP_POLL_ADDRESS} from "../constants";
import db from "../db/db";
import {Transaction} from "../types";
import {buildRequestAndFetch, buildUrl} from "../utils";

const fetchRecentTransactions =
    () =>
       Promise.resolve(
            new URLSearchParams({
            module: 'account',
            action: 'tokentx',
            address: UNISWAP_POLL_ADDRESS,
            startblock:'0',
            endblock: '99999999',
            page: '1',
            offset: '10000',
            sort: 'desc',
            apikey: ETHERSCAN_API_KEY || ''
        }))
        .then(buildRequestAndFetch<Transaction[]>)

const insertTransactionIntoDb = (transaction: Transaction) =>
    db
    .query("INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, timeStamp) VALUES (?, ?, ?, ?)")
    .run(transaction.hash, transaction.blockNumber, transaction.gasUsed, transaction.timeStamp);

const insertTransactionsIntoDb = (transactions: Transaction[]) =>
    transactions.forEach(insertTransactionIntoDb);

export const pollTransactions = () => {
    const poll = () =>
        fetchRecentTransactions()
        .then(insertTransactionsIntoDb)
        .then(() => console.log("Fetched transactions at", new Date()))
        .catch(err => console.error("Error fetching transactions:", err));

    poll().then();
    setInterval(poll, 1000);
};
import db from "../db/db";
import {ETHERSCAN_API_KEY, ETHERSCAN_URL, UNISWAP_POLL_ADDRESS} from "../constants";
import {Transaction} from "../types";
import {build} from "bun";
import {buildRequestAndFetch, buildUrl} from "../utils";

const findTransactions = (start: string, end: string) =>
    db
    .query("SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ?")
    .all(start, end) as Transaction[];

const fetchBlockWithTimestamp = (timestamp: number, closest: 'before' | 'after') =>
    Promise.resolve(new URLSearchParams({
        module: 'block',
        action: 'getblocknobytime',
        timestamp: timestamp.toString(),
        closest: closest,
    }))
    .then(buildRequestAndFetch<number>)

const fetchBlocksWithTimestamp = (start: string, end: string) => {
    const startingBlock = fetchBlockWithTimestamp(parseInt(start), 'after')
    const endingBlock = fetchBlockWithTimestamp(parseInt(end), 'before')

    return Promise.all([startingBlock, endingBlock])
        .then(([start, end]) => ({ start, end }))
        .catch(err => Promise.reject(err));
}

export const queryTransactions = (start: string, end: string) =>
    findTransactions(start, end) ??
    fetchBlocksWithTimestamp(start, end)
        .then(({ start, end }) => findTransactions(start.toString(), end.toString()))
        .catch(err => Promise.reject(err));
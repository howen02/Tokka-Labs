import db from '../db/db'
import { Transaction } from '../types'
import { buildRequestAndFetch } from '../utils'
import { UNISWAP_POOL_ADDRESS } from '../constants'
import { insertTransactionIntoDb, queryRecentTransactions } from '../db/query'

const findTransactionsInTimeRange = (start: string, end: string) =>
	db
		.query('SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ?')
		.all(Number(start), Number(end)) as Transaction[]

const fetchBlockWithTimestamp = (
	timestamp: number,
	closest: 'before' | 'after'
) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'block',
			action: 'getblocknobytime',
			timestamp: timestamp.toString(),
			closest: closest
		})
	)
		.then(buildRequestAndFetch<number>)
		.then(res => res.result)
		.catch(err => Promise.reject(err))

const fetchBlocksWithTimestamp = (start: string, end: string) =>
	Promise.all([
		fetchBlockWithTimestamp(parseInt(start), 'after'),
		fetchBlockWithTimestamp(parseInt(end), 'before')
	])
		.then(([startBlock, endBlock]) => ({ startBlock, endBlock }))
		.catch(err => Promise.reject(err))

const fetchTransactionsBetweenBlocks = (start: number, end: number) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'account',
			action: 'tokentx',
			address: UNISWAP_POOL_ADDRESS,
			startblock: start.toString(),
			endblock: end.toString(),
			page: '1',
			offset: '10000',
			sort: 'asc'
		})
	)
		.then(buildRequestAndFetch<Transaction[]>)
		.then(res => res.result)
		.then(transactions => {
			transactions.forEach(insertTransactionIntoDb)
			return transactions
		})
		.catch(err => Promise.reject(err))

export const queryTransactions = (
	startTime: string | undefined,
	endTime: string | undefined
) =>
	startTime && endTime ?
		(findTransactionsInTimeRange(startTime, endTime) ??
		fetchBlocksWithTimestamp(startTime, endTime).then(
			({ startBlock, endBlock }) =>
				fetchTransactionsBetweenBlocks(startBlock, endBlock)
		))
	:	queryRecentTransactions()

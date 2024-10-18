import { Transaction } from '../types'
import { buildRequestAndFetch } from '../utils'
import { UNISWAP_POOL_ADDRESS } from '../constants'
import {
	insertTransactionIntoDb,
	queryRecentTransactions,
	queryTransactionsInTimeRange
} from '../db/query'

export const queryTransactions = (
	startTime: string | undefined,
	endTime: string | undefined
) =>
	Promise.resolve(
		startTime && endTime ?
			findTransactionsInTimeRange(startTime, endTime)
		:	queryRecentTransactions()
	).then(txs =>
		txs.length ?
			{
				status: 200,
				body: { message: `${txs.length} transaction(s) found`, data: txs }
			}
		:	{ status: 404, body: { message: 'No transactions found' } }
	)

const findTransactionsInTimeRange = (start: string, end: string) =>
	Promise.resolve({ start, end })
		.then(({ start, end }) => queryTransactionsInTimeRange(start, end))
		.then(txs =>
			txs.length ? txs : (
				fetchTransactionsInTimeRange(start, end).then(txs =>
					txs.length ? txs : Promise.reject('No transactions found')
				)
			)
		)

const fetchTransactionsInTimeRange = (start: string, end: string) =>
	fetchBlockRange(start, end)
		.then(({ startBlock, endBlock }) =>
			fetchTransactionsBetweenBlocks(startBlock, endBlock)
		)
		.catch(err => Promise.reject('Error fetching transactions' + err))

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
		.catch(err => Promise.reject('Error fetching block with timestamp' + err))

const fetchBlockRange = (start: string, end: string) =>
	Promise.all([
		fetchBlockWithTimestamp(parseInt(start), 'after'),
		fetchBlockWithTimestamp(parseInt(end), 'before')
	])
		.then(([startBlock, endBlock]) => ({ startBlock, endBlock }))
		.catch(err => Promise.reject('Error fetching block range' + err))

const fetchTransactionsBetweenBlocks = (start: number, end: number) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'account',
			action: 'tokentx',
			address: UNISWAP_POOL_ADDRESS,
			startblock: start.toString(),
			endblock: end.toString(),
			page: '1',
			offset: '10_000',
			sort: 'asc'
		})
	)
		.then(buildRequestAndFetch<Transaction[]>)
		.then(res => res.result)
		.then(transactions => {
			transactions.forEach(insertTransactionIntoDb)
			return transactions
		})
		.catch(err =>
			Promise.reject('Error fetching transactions between blocks' + err)
		)

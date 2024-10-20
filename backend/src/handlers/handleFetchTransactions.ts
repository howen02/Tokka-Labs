import { Transaction } from '../types'
import { buildRequestAndFetch } from '../utils'
import { UNISWAP_POOL_ADDRESS } from '../constants'
import {
	insertTransactionsIntoDb,
	queryRecentTransactions,
	queryTransactionsInTimeRange
} from '../db/query'
import { appendEthPrice } from './handleFetchTransaction'

export const getRecentTransactions = (page: number, pageSize: number) =>
	Promise.resolve(queryRecentTransactions(page, pageSize))
		.then(txs =>
			txs ?
				{
					status: 200,
					body: { message: `${txs.length} transaction(s) found`, data: txs }
				}
			:	{ status: 404, body: { message: 'No transactions found' } }
		)
		.catch(err => ({ status: 500, body: { message: err } }))

export const getTransactionsInTimeRange = (
	startTime: string,
	endTime: string,
	page: number,
	pageSize: number
) =>
	Promise.resolve(
		findTransactionsInTimeRange(startTime, endTime, page, pageSize)
	)
		.then(txs => ({
			status: 200,
			body: { message: `${txs.length} transaction(s) found`, data: txs }
		}))
		.catch(err => ({ status: 404, body: { message: err } }))

const findTransactionsInTimeRange = (
	start: string,
	end: string,
	page: number,
	pageSize: number
) =>
	Promise.resolve({ start, end })
		.then(({ start, end }) =>
			queryTransactionsInTimeRange(start, end, page, pageSize)
		)
		.then(txs =>
			txs.length ? txs : (
				fetchTransactionsInTimeRange(start, end).then(txs =>
					txs.length ?
						txs.slice((page - 1) * pageSize, page * pageSize)
					:	Promise.reject('No transactions found')
				)
			)
		)

const fetchTransactionsInTimeRange = (start: string, end: string) =>
	fetchBlockRange(start, end)
		.then(({ startBlock, endBlock }) =>
			fetchTransactionsBetweenBlocks(startBlock, endBlock)
		)
		.catch(err =>
			Promise.reject('Error fetching transactions in time range: ' + err)
		)

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
		.catch(err => Promise.reject('Error fetching block with timestamp: ' + err))

const fetchBlockRange = (start: string, end: string) =>
	Promise.all([
		fetchBlockWithTimestamp(parseInt(start), 'after'),
		fetchBlockWithTimestamp(parseInt(end), 'before')
	])
		.then(([startBlock, endBlock]) => ({ startBlock, endBlock }))
		.catch(err => Promise.reject('Error fetching block range: ' + err))

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
			sort: 'desc'
		})
	)
		.then(buildRequestAndFetch<Transaction[]>)
		.then(res => res.result)
		.then(transactions =>
			Promise.all(transactions.map(transaction => appendEthPrice(transaction)))
		)
		.then(transactions =>
			insertTransactionsIntoDb(transactions).then(() => transactions)
		)
		.catch(err =>
			Promise.reject('Error fetching transactions between blocks: ' + err)
		)

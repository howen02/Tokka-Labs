import db from '../db/db'
import { Transaction } from '../types'
import { buildRequestAndFetch } from '../utils'
import { UNISWAP_POOL_ADDRESS } from '../constants'
import { insertTransactionIntoDb } from '../db/query'

const findTransactions = (start: string, end: string) =>
	db
		.query('SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ?')
		.all(start, end) as Transaction[]

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

const fetchTransctionsBetweenBlocks = (start: number, end: number) =>
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
		})
		.catch(err => Promise.reject(err))

export const queryTransactions = (
	startTime: string | undefined,
	endTime: string | undefined
) =>
	startTime && endTime ?
		(findTransactions(startTime, endTime) ??
		fetchBlocksWithTimestamp(startTime, endTime).then(
			({ startBlock, endBlock }) =>
				fetchTransctionsBetweenBlocks(startBlock, endBlock)
		))
	:	Promise.reject('Invalid time range')

import { Transaction } from '../types'
import db from './db'

export const insertTransactionIntoDb = (transaction: Transaction) =>
	db
		.query(
			'INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, gasPrice, ethPrice, timeStamp) VALUES (?, ?, ?, ?, ?, ?)'
		)
		.run(
			transaction.hash,
			transaction.blockNumber,
			transaction.gasUsed,
			transaction.gasPrice,
			transaction.ethPrice,
			transaction.timeStamp
		)

export const insertTransactionsIntoDb = (transactions: Transaction[]) =>
	Promise.all(transactions.map(insertTransactionIntoDb))

export const queryRecentTransactions = (page: number, pageSize: number) =>
	db
		.query(
			'SELECT * FROM transactions ORDER BY timeStamp DESC LIMIT ? OFFSET ?'
		)
		.all(pageSize, (page - 1) * pageSize) as Transaction[]

export const queryTransactionsInTimeRange = (
	start: string,
	end: string,
	page: number,
	pageSize: number
) =>
	db
		.query(
			'SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ? ORDER BY timeStamp DESC LIMIT ? OFFSET ?'
		)
		.all(
			Number(start),
			Number(end),
			pageSize,
			(page - 1) * pageSize
		) as Transaction[]

export const queryTransaction = (hash: string): Transaction =>
	db
		.query('SELECT * FROM transactions WHERE hash = $hash')
		.get({ $hash: hash }) as Transaction

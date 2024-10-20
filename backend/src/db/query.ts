import { Transaction } from '../types'
import db from './db'

export const insertTransactionIntoDb = (transaction: Transaction) =>
	db
		.query(
			'INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, gasPrice, timeStamp) VALUES (?, ?, ?, ?, ?)'
		)
		.run(
			transaction.hash,
			transaction.blockNumber,
			transaction.gasUsed,
			transaction.gasPrice,
			transaction.timeStamp
		)

export const insertTransactionsIntoDb = (transactions: Transaction[]) =>
	transactions.forEach(insertTransactionIntoDb)

export const queryRecentTransactions = (page: number, pageSize: number) =>
	db
		.query(
			'SELECT * FROM transactions ORDER BY timeStamp DESC LIMIT ? OFFSET ?'
		)
		.all(pageSize, (page - 1) * pageSize) as Transaction[]

export const queryTransactionsInTimeRange = (start: string, end: string) =>
	db
		.query('SELECT * FROM transactions WHERE timeStamp BETWEEN ? AND ?')
		.all(Number(start), Number(end)) as Transaction[]

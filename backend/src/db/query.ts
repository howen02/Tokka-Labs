import { Transaction } from '../types'
import db from './db'
import { END_OF_DAY_OFFSET } from '../constants'

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
	Promise.resolve(transactions)
		.then(txs => {
			const placeholders = txs.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')
			const sql = `INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, gasPrice, ethPrice, timeStamp) VALUES ${placeholders}`
			return { sql, txs }
		})
		.then(({ sql, txs }) => {
			const values = txs.flatMap(t => [
				t.hash,
				t.blockNumber,
				t.gasUsed,
				t.gasPrice,
				t.ethPrice,
				t.timeStamp
			])
			return { sql, values }
		})
		.then(({ sql, values }) => db.query(sql).run(...values))

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
			Number(end) + END_OF_DAY_OFFSET,
			pageSize,
			(page - 1) * pageSize
		) as Transaction[]

export const queryTransaction = (hash: string): Transaction =>
	db
		.query('SELECT * FROM transactions WHERE hash = $hash')
		.get({ $hash: hash }) as Transaction

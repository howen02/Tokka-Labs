import { Transaction } from '../types'
import db from './db'

export const insertTransactionIntoDb = (transaction: Transaction) =>
	db
		.query(
			'INSERT OR IGNORE INTO transactions (hash, blockNumber, gasUsed, timeStamp) VALUES (?, ?, ?, ?)'
		)
		.run(
			transaction.hash,
			transaction.blockNumber,
			transaction.gasUsed,
			transaction.timeStamp
		)

export const insertTransactionsIntoDb = (transactions: Transaction[]) =>
	transactions.forEach(insertTransactionIntoDb)

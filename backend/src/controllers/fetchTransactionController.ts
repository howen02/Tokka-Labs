import db from '../db/db'
import { Transaction } from '../types'

export const fetchTransaction = (hash: string) =>
	Promise.resolve(hash)
		.then(findTransactionInDb)
		.then(tx =>
			tx ?
				{
					status: 200,
					body: { message: 'Transaction found', data: tx }
				}
			:	{ status: 404, body: { message: 'Transaction not found' } }
		)

const findTransactionInDb = (hash: string): Transaction =>
	db
		.query('SELECT * FROM transactions WHERE hash = $hash')
		.get({ $hash: hash }) as Transaction

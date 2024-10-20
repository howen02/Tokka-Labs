import db from '../db/db'
import { Transaction, TransactionReceipt } from '../types'
import { buildRequestAndFetch } from '../utils'
import { insertTransactionIntoDb } from '../db/query'

export const getTransaction = (hash: string) =>
	Promise.resolve(hash)
		.then(queryTransaction || fetchTransaction)
		.then(tx => ({
			status: 200,
			body: { message: 'Transaction found', data: tx }
		}))
		.catch(err => ({ status: 404, body: { message: err } }))

const queryTransaction = (hash: string): Transaction =>
	db
		.query('SELECT * FROM transactions WHERE hash = $hash')
		.get({ $hash: hash }) as Transaction

const fetchTransaction = (hash: string) =>
	fetchTransactionReceipt(hash)
		.then(res => appendTimeStamp(res.result))
		.then(tx => {
			insertTransactionIntoDb(tx)
			return tx
		})
		.catch(err => Promise.reject('Error fetching transaction' + err))

const fetchTransactionReceipt = (hash: string) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'proxy',
			action: 'eth_getTransactionReceipt',
			txhash: hash
		})
	)
		.then(buildRequestAndFetch<TransactionReceipt>)
		.then(res => res)
		.catch(err => Promise.reject('Error fetching transaction receipt' + err))

const appendTimeStamp = (receipt: TransactionReceipt) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'block',
			action: 'getblockreward',
			blockno: receipt.blockNumber.toString()
		})
	)
		.then(buildRequestAndFetch<{ timeStamp: string }>)
		.then(
			res =>
				({
					...receipt,
					gasPrice: receipt.effectiveGasPrice,
					timeStamp: parseInt(res.result.timeStamp)
				}) as Transaction
		)
		.catch(err => Promise.reject('Error fetching block reward' + err))

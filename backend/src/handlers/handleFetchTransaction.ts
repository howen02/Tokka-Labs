import { Transaction, TransactionReceipt } from '../types'
import {appendHistorialEthPrice, buildRequestAndFetch } from '../utils'
import { insertTransactionIntoDb, queryTransaction } from '../db/query'

export const getTransaction = (hash: string) =>
	Promise.resolve(hash)
		.then(queryTransaction || fetchTransaction)
		.then(tx =>
			tx ?
				{
					status: 200,
					body: { message: 'Transaction found', data: tx }
				}
			:	{ status: 404, body: { message: 'Transaction not found' } }
		)
		.catch(err => ({ status: 500, body: { message: err } }))

const fetchTransaction = (hash: string) =>
	fetchTransactionReceipt(hash)
		.then(appendTimeStamp)
		.then(appendHistorialEthPrice)
		.then(tx => {
			insertTransactionIntoDb(tx)
			return tx
		})
		.catch(err => Promise.reject('Error fetching transaction: ' + err))

const fetchTransactionReceipt = (hash: string) =>
	Promise.resolve(
		new URLSearchParams({
			module: 'proxy',
			action: 'eth_getTransactionReceipt',
			txhash: hash
		})
	)
		.then(buildRequestAndFetch<TransactionReceipt>)
		.then(res => res.result)
		.catch(err => Promise.reject('Error fetching transaction receipt: ' + err))

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
					ethPrice: 0,
					timeStamp: parseInt(res.result.timeStamp)
				}) as Transaction
		)
		.catch(err => Promise.reject('Error fetching block reward: ' + err))


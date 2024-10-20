import { UNISWAP_POOL_ADDRESS } from '../constants'
import { Transaction } from '../types'
import { buildRequestAndFetch, fetchLiveEthPrice } from '../utils'
import { insertTransactionsIntoDb } from '../db/query'

export const fetchRecentTransactions = () =>
	Promise.resolve(
		new URLSearchParams({
			module: 'account',
			action: 'tokentx',
			address: UNISWAP_POOL_ADDRESS,
			startblock: '0',
			endblock: '99999999',
			page: '1',
			offset: '10_000',
			sort: 'desc'
		})
	).then(buildRequestAndFetch<Transaction[]>)

export const pollTransactions = () =>
	Promise.all([fetchRecentTransactions(), fetchLiveEthPrice()])
		.then(([res, ethPrice]) =>
			insertTransactionsIntoDb(
				res.result.map(tx => ({ ...tx, ethPrice })) as Transaction[]
			)
		)
		.then(() =>
			console.log(
				`[${new Date().toLocaleString()}] Successfully polled transactions`
			)
		)
		.catch(err => console.error('Error fetching transactions:', err))

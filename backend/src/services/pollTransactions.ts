import { UNISWAP_POOL_ADDRESS } from '../constants'
import { Transaction } from '../types'
import { buildRequestAndFetch } from '../utils'
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
			offset: '10000',
			sort: 'desc'
		})
	).then(buildRequestAndFetch<Transaction[]>)

export const pollTransactions = () => {
	const poll = () =>
		fetchRecentTransactions()
			.then(res => res.result)
			.then(insertTransactionsIntoDb)
			.then(() => console.log('Fetched transactions at', new Date()))
			.catch(err => console.error('Error fetching transactions:', err))

	poll().then()
	setInterval(poll, 1000)
}

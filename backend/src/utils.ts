import {
	BINANCE_ETH_PRICE_URL,
	BINANCE_HISTORICAL_ETH_PRICE_URL,
	ETHERSCAN_API_KEY,
	ETHERSCAN_URL,
	FALLBACK_ETH_PRICE
} from './constants'
import { GenericResponse, Transaction } from './types'

export const buildUrl = (params: URLSearchParams) => {
	if (!ETHERSCAN_API_KEY) throw new Error('ETHERSCAN_API_KEY is missing')
	params.append('apikey', ETHERSCAN_API_KEY)

	return `${ETHERSCAN_URL}?${params.toString()}`
}

export const buildRequestAndFetch = <T>(
	params: URLSearchParams
): Promise<GenericResponse<T>> =>
	Promise.resolve(params)
		.then(buildUrl)
		.then(fetch)
		.then(res => res.json() as unknown as GenericResponse<T>)
		.catch(err => Promise.reject(err))

export const fetchLiveEthPrice = () =>
	fetch(BINANCE_ETH_PRICE_URL)
		.then(res => res.json())
		.then(res => parseFloat(res.price))
		.catch(err => {
			console.error(
				'Error fetching live ETH price: ' +
					err +
					'\nUsing default value of ' +
					FALLBACK_ETH_PRICE
			)
			return FALLBACK_ETH_PRICE
		})

export const fetchHistoricalEthPrice = (timeStamp: number) =>
	Promise.resolve(
		new URLSearchParams({
			symbol: 'ETHUSDT',
			interval: '1m',
			startTime: timeStamp.toString(),
			limit: '1'
		})
	)
		.then(params =>
			fetch(`${BINANCE_HISTORICAL_ETH_PRICE_URL}?${params.toString()}`)
		)
		.then(res => res.json())
		.then(data => parseFloat(data[0][4]))
		.catch(err => {
			console.error(
				'Error fetching historical ETH price: ' +
					err +
					'\nUsing default value of ' +
					FALLBACK_ETH_PRICE
			)
			return FALLBACK_ETH_PRICE
		})

export const appendHistorialEthPrice = (tx: Transaction) =>
	Promise.resolve(tx.timeStamp)
		.then(fetchHistoricalEthPrice)
		.then(price => ({ ...tx, ethPrice: price }))
		.catch(err => Promise.reject('Error appending ETH price: ' + err))

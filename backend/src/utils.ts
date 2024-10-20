import {
	BINANCE_ETH_PRICE_URL,
	BINANCE_HISTORICAL_ETH_PRICE_URL,
	ETHERSCAN_API_KEY,
	ETHERSCAN_URL
} from './constants'
import { GenericResponse } from './types'

export const buildUrl = (params: URLSearchParams) => {
	if (ETHERSCAN_API_KEY) params.append('apikey', ETHERSCAN_API_KEY)

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
	fetch(`${BINANCE_ETH_PRICE_URL}?symbol=ETHUSDT`)
		.then(res => res.json())
		.then(res => parseFloat(res.price))
		.catch(err => Promise.reject('Error fetching live ETH price: ' + err))

export const fetchHistoricalEthPrice = (timestamp: number) => {
	const endTime = timestamp * 1000
	const startTime = endTime - 60000

	return fetch(
		`${BINANCE_HISTORICAL_ETH_PRICE_URL}?symbol=ETHUSDT&interval=1m&startTime=${startTime}&endTime=${endTime}&limit=1`
	)
		.then(response => response.json())
		.then(data => parseFloat(data[0][4]))
		.catch(err => Promise.reject('Error fetching historical ETH price: ' + err))
}

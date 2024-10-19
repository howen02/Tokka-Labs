import { ETHERSCAN_API_KEY, ETHERSCAN_URL } from './constants'
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

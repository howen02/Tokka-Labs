import { decodeSwapPrice } from '../services/decoder'

export const handleDecode = (hash: string) =>
	decodeSwapPrice(hash)
		.then(prices =>
			prices ?
				{ status: 200, body: { message: 'Price decoded', data: prices } }
			:	{ status: 404, body: { message: 'Price not found' } }
		)
		.catch(err => ({
			status: 500,
			body: { message: 'Error decoding price: ' + err }
		}))

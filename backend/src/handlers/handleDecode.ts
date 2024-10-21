import { decodeSwapPrice } from '../services/decoder'

export const handleDecode = (hash: string) =>
	decodeSwapPrice(hash)
		.then(price =>
			price ?
				{ status: 200, body: { message: 'Price', data: price } }
			:	{ status: 404, body: { message: 'Price not found' } }
		)
		.catch(err => ({
			status: 500,
			body: { message: 'Error decoding price: ' + err }
		}))

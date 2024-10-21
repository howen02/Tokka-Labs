import Web3 from 'web3'
import { INFURA_PROVIDER, UNISWAP_POOL_ADDRESS } from '../constants'

const UNISWAP_SWAP_CONTRACT_SIGNATURE =
	'Swap(address,address,int256,int256,uint160,uint128,int24)'
const EVENT_PARAMETERS = [
	{ type: 'address', name: 'sender', indexed: true },
	{ type: 'address', name: 'recipient', indexed: true },
	{ type: 'int256', name: 'amount0' },
	{ type: 'int256', name: 'amount1' },
	{ type: 'uint160', name: 'sqrtPriceX96' },
	{ type: 'uint128', name: 'liquidity' },
	{ type: 'int24', name: 'tick' }
]

const provider = new Web3.providers.HttpProvider(INFURA_PROVIDER)
const web3 = new Web3(provider)

export const decodeSwapPrice = (hash: string) =>
	web3.eth
		.getTransactionReceipt(hash)
		.then(receipt =>
			receipt.logs.filter(
				log =>
					log?.address?.toLowerCase() === UNISWAP_POOL_ADDRESS.toLowerCase() &&
					log?.topics?.[0] === web3.utils.sha3(UNISWAP_SWAP_CONTRACT_SIGNATURE)
			)
		)
		.then(swapEvents =>
			swapEvents.map(e => {
				const decodedLog = web3.eth.abi.decodeLog(
					EVENT_PARAMETERS,
					e.data as string,
					e?.topics?.slice(1) as string[]
				)
				const sqrtPriceX96 = BigInt(decodedLog.sqrtPriceX96 as string)
				const Q96 = BigInt(2 ** 96)
				const P = (sqrtPriceX96 / Q96) ** BigInt(2)
				const price = BigInt(1e12) / P
				return Number(price)
			})
		)
		.then(prices => (prices.length ? prices : null))

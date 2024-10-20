import dotenv from 'dotenv'

dotenv.config()

export const UNISWAP_POOL_ADDRESS = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'
export const ETHERSCAN_URL = 'https://api.etherscan.io/api'
export const BINANCE_ETH_PRICE_URL =
	'https://api.binance.com/api/v3/ticker/price'
export const BINANCE_HISTORICAL_ETH_PRICE_URL =
	'https://api.binance.com/api/v3/klines'

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
export const SERVER_PORT = process.env.SERVER_PORT || 3000
